import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { Role } from './auth.enum'
import { TokenPayload } from './entity/tokenpayload.entity'
import { IDetailUser, ITeacher, IUser } from './auth.interface'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async testApi() {
    const response = await firstValueFrom(
      this.httpService.get(
        'http://api.lethanhhuyen.nvcd.xyz/api/training/users/test',
      ),
    )
    return response.data
  }
  async validateUser(username: string, password: string) {
    try {
      const user = await firstValueFrom(
        this.client.send<IUser>(
          { role: 'user', cmd: 'get-by-email' },
          username,
        ),
      )
      console.log(user)
      if (user === null) {
        return null
      }
      await this.verifyPassword(password, user.password)
      return user
    } catch (e) {
      Logger.log(e)
      throw e
    }
  }

  async validateId(id: number, password: string) {
    try {
      const user = await firstValueFrom(
        this.client.send<IUser>({ role: 'user', cmd: 'get-by-id' }, id),
      )
      if (user === null) {
        return null
      }
      await this.verifyPassword(password, user?.password)
      return user
    } catch (e) {
      Logger.log(e)
      throw e
    }
  }

  public getJWTToken(userID: number, role: Role, name: string) {
    const payload: TokenPayload = { userID, role, name }
    return this.jwtService.sign(payload)
  }

  public async getName(id: number, role: Role) {
    if (role === Role.Student || role === Role.Monitor) {
      const data = await firstValueFrom(
        this.client.send<IDetailUser>(
          { role: 'detail-user', cmd: 'get-by-id' },
          id,
        ),
      )
      return data.name
    }
    if (role === Role.Teacher) {
      const data = await firstValueFrom(
        this.client.send<ITeacher>(
          { role: 'teacher', cmd: 'get-teacher-id' },
          id,
        ),
      )
      return data.teacherName
    } else {
      return role
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    )
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt)
  }
}
