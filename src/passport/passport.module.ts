import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'oauth2' }),
    // Otros módulos y configuraciones de tu aplicación
  ],
})
export class PassModule {}
