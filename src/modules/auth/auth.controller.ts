import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { ResponseAuthDto } from './dto/responseAuth.dto'
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: AuthDto })
  async logIn(@Req() req) {
    const name = await this.authService.getName(req.user.userID, req.user.role)
    const user: ResponseAuthDto = {
      userID: req.user.userID,
      token: this.authService.getJWTToken(req.user.userID, req.user.role, name),
      role: req.user.role,
    }
    return user
  }

  @Get('/test')
  async get() {
    return this.authService.testApi()
  }
  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(jwt: string) {
    try {
      const res = this.authService.validateToken(jwt)

      return res
    } catch (e) {
      Logger.log(e)
      return false
    }
  }
}
