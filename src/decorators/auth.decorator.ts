import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
}
