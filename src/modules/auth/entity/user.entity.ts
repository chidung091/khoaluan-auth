import { Role } from '../auth.enum'

export interface UserAuth {
  id: number
  role: Role
}
