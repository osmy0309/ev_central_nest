import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { AuthOauthService } from '../auth_oauth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthOauthService,
  ) {
    super({
      //authorizationURL: 'URL_de_autorización',
      //tokenURL: 'URL_de_obtención_de_token',
      clientID:
        '832697763906-u7tpcn80tte3lklj1h44glb662uma5tm.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3800/auth-oauth/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // Aquí puedes realizar acciones con los tokens de acceso y actualización, y el perfil del usuario
    // Por ejemplo, puedes guardar la información del usuario en una base de datos
    // Luego, puedes retornar los datos del usuario para que estén disponibles en los controladores
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const newUser: createUserDto = {
      email: profile._json.email,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
      username: profile._json.name,
    };
    const expiresIn = 1000 * 60 * 60 * 24;
    const user = await this.authService.validateUser(newUser);
    const data = {
      user,
      token: accessToken,
      expires_in: new Date(Date.now() + expiresIn),
    };
    return data || null;
  }
}
