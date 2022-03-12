import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Role } from 'src/modules/auth/auth.enum'

export class ResponseAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: Role
}
