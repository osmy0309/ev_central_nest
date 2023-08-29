import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor() {
    super({
      authorizationURL: 'URL_de_autorización',
      tokenURL: 'URL_de_obtención_de_token',
      clientID: 'ID_de_cliente',
      clientSecret: 'Secreto_de_cliente',
      callbackURL: 'URL_de_retorno_después_de_la_autenticación',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Aquí puedes realizar acciones con los tokens de acceso y actualización, y el perfil del usuario
    // Por ejemplo, puedes guardar la información del usuario en una base de datos
    // Luego, puedes retornar los datos del usuario para que estén disponibles en los controladores
    return profile;
  }
}
