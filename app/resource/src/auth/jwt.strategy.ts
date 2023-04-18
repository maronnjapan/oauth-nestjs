import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as jsrsasignUtil from 'jsrsasign-util';

const publicPem = jsrsasignUtil.readFile(__dirname.replace(/resource\/dist[\S]*/g, '') + 'authorization/public-key.pem')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicPem,
        });
    }

    async validate(payload: any) {

        return payload
    }
}