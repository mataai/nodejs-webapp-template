import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const REQUIRE_AUTH_KEY = 'requiresAuth';
export const Authenticated = (): CustomDecorator<string> =>
  SetMetadata(REQUIRE_AUTH_KEY, true);
