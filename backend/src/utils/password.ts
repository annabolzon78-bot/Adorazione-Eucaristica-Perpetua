import bcrypt from 'bcryptjs'
import { env } from '../config/env'

export const passwordUtils = {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, env.BCRYPT_ROUNDS)
  },
  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  },
  validate(password: string): string | null {
    if (password.length < 8)           return 'La password deve avere almeno 8 caratteri'
    if (!/[A-Z]/.test(password))       return 'La password deve contenere almeno una lettera maiuscola'
    if (!/[0-9]/.test(password))       return 'La password deve contenere almeno un numero'
    return null
  },
}
