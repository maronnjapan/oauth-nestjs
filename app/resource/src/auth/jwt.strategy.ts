import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jsrsasignUtil from 'jsrsasign-util';
import { Config } from 'src/utils/Config';
import axios, { AxiosResponse } from 'axios';

const publicPem = jsrsasignUtil.readFile(__dirname.replace(/resource\/dist[\S]*/g, '') + 'authorization/public-key.pem')


type Introspect = {
    active: boolean
}

export type Payload = {
    iss: string;
    sub: string;
    aud: string;
    iat: number,
    exp: number,
    jti: string;
    scope: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicPem,
        });
    }

    async validate(payload: Payload) {
        const formData = {
            sub: payload.sub
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Config.getEncodeClientCredentials()
        }
        try {
            const response: AxiosResponse<Introspect> = await axios.post(Config.getIntrospectEndpoint(), formData, { headers: headers });
            if (response.data.active) {
                return payload
            }
            throw new UnauthorizedException()
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}