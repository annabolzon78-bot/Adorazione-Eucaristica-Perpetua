import { z } from 'zod'
export const registerSchema = z.object({
  email:       z.string().email('Email non valida').toLowerCase(),
  password:    z.string().min(8, 'Min 8 caratteri').max(100),
  name:        z.string().min(2, 'Nome troppo corto').max(100).trim(),
  displayName: z.string().max(50).optional(),
  countryId:   z.string().optional(),
  languageId:  z.string().optional(),
})
export const loginSchema = z.object({
  email:    z.string().email().toLowerCase(),
  password: z.string().min(1),
})
export const refreshSchema       = z.object({ refreshToken: z.string().min(1) })
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(100) })
export const forgotPasswordSchema = z.object({ email: z.string().email().toLowerCase() })
