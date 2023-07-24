import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/login-auth.dto';
import { registerUserDto } from './dto/register.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetPrincipal } from 'src/decorators/get-principal.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Autentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@UseGuards(AuthGuard)
  @Post('register')
  registerUser(@Body() userObjet: registerUserDto) {
    return this.authService.register(userObjet);
  }

  @Post('login')
  loginUser(@Body() userLogin: loginUserDto) {
    return this.authService.login(userLogin);
  }
  @Get('logoutall')
  logout() {
    return this.authService.logoutall();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profileUser(@GetPrincipal() user: any) {
    return this.authService.profileService(user.id);
  }
}
