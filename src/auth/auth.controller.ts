import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/login-auth.dto';
import { registerUserDto } from './dto/register.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/rol/decorator/rol.decorator';
import { Auth } from 'src/decorators/auth.decorator';
@ApiTags('Autentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@UseGuards(AuthGuard)
  /*@Post('register')
  registerUser(@Body() userObjet: registerUserDto) {
    return this.authService.register(userObjet);
  }*/
  @Get('version')
  version() {
    return 'v1.0.96';
  }
  @Post('login')
  loginUser(@Body() userLogin: loginUserDto) {
    return this.authService.login(userLogin);
  }
  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('logoutall')
  logout() {
    return this.authService.logoutall();
  }

  @Roles('ADMIN', 'AUTOR')
  @ApiBearerAuth()
  @Auth()
  @Get('profile')
  profileUser(@GetPrincipal() user: any) {
    return this.authService.profileService(user.id);
  }
}
