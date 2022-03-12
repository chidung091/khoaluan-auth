import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AuthDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string
}
