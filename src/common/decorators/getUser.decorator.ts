import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from 'src/modules/users/interfaces/request-user.interface';

export const User = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    return data ? user?.[data] : user;
  },
);
