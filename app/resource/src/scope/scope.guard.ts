import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';


type Scope = {
  scopeName: 'read' | 'write' | 'delete' | 'openid'
}

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private scope: Scope[]) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const accessToken = authHeader.slice('bearer '.length);
    const tokenParts = accessToken.split('.')
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    return this.scope.filter((s) => payload.scope.includes(s.scopeName)).length === this.scope.length ? true : false;
  }
}
