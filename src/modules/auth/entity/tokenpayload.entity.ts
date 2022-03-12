import { Role } from '../auth.enum'

export interface TokenPayload {
  userId: number
  role: Role
  name: string
}
