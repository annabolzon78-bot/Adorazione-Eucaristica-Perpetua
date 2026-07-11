import { prisma } from '../config/database'
import { passwordUtils } from '../utils/password'
import { jwtUtils } from '../utils/jwt'
import type { Role } from '../types'

export interface TokenPair { accessToken: string; refreshToken: string }

export interface LoginResult extends TokenPair {
  user: { id: string; email: string; name: string; role: Role }
}

export const authService = {
  async register(data: {
    email: string; password: string; name: string;
    displayName?: string; countryId?: string; languageId?: string
  }) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) throw Object.assign(new Error('Email già registrata'), { code: 'EMAIL_EXISTS' })

    const pwdError = passwordUtils.validate(data.password)
    if (pwdError) throw Object.assign(new Error(pwdError), { code: 'WEAK_PASSWORD' })

    const passwordHash = await passwordUtils.hash(data.password)
    return prisma.user.create({
      data: { email: data.email, passwordHash, name: data.name, displayName: data.displayName, countryId: data.countryId, languageId: data.languageId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
  },

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) throw Object.assign(new Error('Credenziali non valide'), { code: 'INVALID_CREDENTIALS' })

    const valid = await passwordUtils.compare(password, user.passwordHash)
    if (!valid) throw Object.assign(new Error('Credenziali non valide'), { code: 'INVALID_CREDENTIALS' })

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      accessToken:  jwtUtils.signAccess(payload),
      refreshToken: jwtUtils.signRefresh(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  },

  async refresh(token: string): Promise<TokenPair> {
    const payload = jwtUtils.verifyRefresh(token)
    const user    = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, role: true, isActive: true } })
    if (!user?.isActive) throw Object.assign(new Error('Token non valido'), { code: 'INVALID_TOKEN' })
    const p = { sub: user.id, email: user.email, role: user.role }
    return { accessToken: jwtUtils.signAccess(p), refreshToken: jwtUtils.signRefresh(p) }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
    const valid = await passwordUtils.compare(currentPassword, user.passwordHash)
    if (!valid) throw Object.assign(new Error('Password attuale non corretta'), { code: 'WRONG_PASSWORD' })
    const pwdError = passwordUtils.validate(newPassword)
    if (pwdError) throw Object.assign(new Error(pwdError), { code: 'WEAK_PASSWORD' })
    const passwordHash = await passwordUtils.hash(newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  },
}
