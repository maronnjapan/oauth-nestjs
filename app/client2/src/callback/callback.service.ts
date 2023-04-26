import { Injectable } from '@nestjs/common';
import * as jsrsasign from 'jsrsasign';
import * as jsrsasignUtil from 'jsrsasign-util';
import { Config } from 'src/config/Config';



type Iheader = {
    typ: string;
    alg: string;
    kid: string;
}
type Ipayload = {
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
}
@Injectable()
export class CallbackService {
    validateIdToken(idToken: string, publicKey: jsrsasign.RSAKey) {
        const idTokenParts = idToken.split('.');
        const payloadJson: Ipayload = JSON.parse(Buffer.from(idTokenParts[1], 'base64').toString());
        const headerToken: Iheader = JSON.parse(Buffer.from(idTokenParts[0], 'base64').toString());
        if (!jsrsasign.KJUR.jws.JWS.verify(idToken, publicKey, [headerToken.alg])) {
            return false;
        }
        if (payloadJson.iss !== Config.getAuthorizationServerEndpoint()) {
            return false;
        }
        if (!Array.isArray(payloadJson.aud) || !payloadJson.aud.includes(process.env.CLIENT_ID)) {
            return false;
        }
        const now = Math.floor(Date.now() / 1000);
        if (payloadJson.iat > now || payloadJson.exp < now) {
            return false
        }
        return true;
    }
}
