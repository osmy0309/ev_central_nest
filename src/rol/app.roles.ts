import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  ADMIN = 'ADMIN',
  AUTOR = 'AUTOR',
  ROLE_USER = 'ROLE_USER',
}

export enum AppRecources {
  USER = 'USER',
  CARD = 'CARD',
  ROL = 'ROL',
}

export const roles: RolesBuilder = new RolesBuilder();
roles
  .grant(AppRoles.AUTOR)
  .updateOwn([AppRecources.CARD])
  .deleteOwn([AppRecources.CARD])
  .createOwn([AppRecources.CARD])
  .updateOwn([AppRecources.CARD])
  .readOwn([AppRecources.CARD])
  .readOwn([AppRecources.ROL])

  .grant(AppRoles.ADMIN)
  .extend([AppRoles.AUTOR])
  .deleteAny([AppRecources.CARD, AppRecources.USER])
  .createAny([AppRecources.CARD, AppRecources.USER, AppRecources.ROL])
  .updateAny([AppRecources.CARD, AppRecources.USER])
  .readAny([AppRecources.CARD, AppRecources.USER, AppRecources.ROL]);
