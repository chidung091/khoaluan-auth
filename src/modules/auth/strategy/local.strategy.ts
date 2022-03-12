import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'id',
    })
  }
  async validate(id: string, password: string) {
    if (this.validateEmail(id)) {
      const user = await this.authenticationService.validateUser(id, password)
      if (!user) {
        throw new UnauthorizedException()
      }
      return user
    } else {
      const user = this.authenticationService.validateId(parseInt(id), password)
      if (!user) {
        throw new UnauthorizedException()
      }
      return user
    }
  }

  validateEmail(email: string) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  }
}
