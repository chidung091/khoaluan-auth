import { Role } from '../auth.enum'

export interface TokenPayload {
  userID: number
  role: Role
  name: string
}
