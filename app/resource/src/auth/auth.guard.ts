import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import * as jsrsasign from 'jsrsasign';
import * as jsrsasignUtil from 'jsrsasign-util';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const accessToken = authHeader.slice('bearer '.length);
    const axiosResponse = await axios.get('http://localhost:3001/token/public-key');
    const publicKey = jsrsasign.KEYUTIL.getKey(axiosResponse.data) as jsrsasign.RSAKey
    if (!jsrsasign.KJUR.jws.JWS.verify(accessToken, publicKey)) {
      return false;
    }
    const tokenParts = accessToken.split('.');

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const date = new Date();
    if (payload.exp < Math.floor(date.getTime() / 1000)) {
      return false;
    }
    return true
  }
}
