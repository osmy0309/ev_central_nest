import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
  );
}
