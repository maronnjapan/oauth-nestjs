import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export type AuthContext = {
    userId: string;
    scope: string[];
};
export const AuthContext = createParamDecorator(
    async (data: unknown, context: ExecutionContext): Promise<AuthContext> => {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;
        const accessToken = authHeader.slice('bearer '.length);
        const tokenParts = accessToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        return { userId: payload.sub, scope: payload.scope }
    }
)
