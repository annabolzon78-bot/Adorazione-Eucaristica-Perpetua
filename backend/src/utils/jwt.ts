import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtPayload {
  sub:   string
  email: string
  role:  string
  iat?:  number
  exp?:  number
}

export const jwtUtils = {
  signAccess(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return (jwt.sign as any)(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  },
  signRefresh(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const secret = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET + '_refresh'
    return (jwt.sign as any)(payload, secret, { expiresIn: env.JWT_REFRESH_EXPIRES_IN })
  },
  verifyAccess(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload
  },
  verifyRefresh(token: string): JwtPayload {
    const secret = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET + '_refresh'
    return jwt.verify(token, secret) as JwtPayload
  },
  decode(token: string): JwtPayload | null {
    try { return jwt.decode(token) as JwtPayload } catch { return null }
  },
}
