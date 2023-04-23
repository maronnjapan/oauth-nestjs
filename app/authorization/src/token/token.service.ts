import { Injectable } from '@nestjs/common';
import { Config } from 'src/config/Config';
import prismaServie from '~/prisma';
import { ClientAuthDto } from './dto/client-auth.dto';
import * as jsrsasign from 'jsrsasign';
import * as jsrsasignUtil from 'jsrsasign-util';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
    getPublicKey() {
        const openPem = jsrsasignUtil.readFile(__dirname.replace(/dist[\S]*/g, '') + 'public-key.pem')
        return openPem
    }
    getClientInfo(formData: ClientAuthDto, authHeader: string) {
        if (formData.client_id && authHeader) {
            return { clientId: undefined, clientSecret: undefined }
        }

        if (formData.client_id) {
            return { clientId: formData.client_id, clientSecret: formData.client_secret }
        }

        if (authHeader) {
            const clientCredentials = Config.decodeClientCredentials(authHeader);
            const clientId = clientCredentials.id;
            const clientSecret = clientCredentials.secret;
            return { clientId, clientSecret }
        }

        return { clientId: undefined, clientSecret: undefined }
    }

    async createToken(clientAuthDto: ClientAuthDto, userData: User, clientId: string) {
        const scope = clientAuthDto.scope.split(' ');
        const jti = Math.random().toString(36).slice(-10);
        const header = {
            typ: 'JWT',
            alg: 'RS256',
            kid: 'authServer'
        }
        const payload = {
            iss: process.env.APP_DOMAIN + '/' + process.env.AUTHRIZATION_PORT,
            sub: userData.sub,
            aud: process.env.APP_DOMAIN + '/' + process.env.RESOURCE_PORT,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (5 * 60),
            jti,
            scope
        }
        await prismaServie.accessToken.create({
            data: {
                access_token: jti,
            }
        })
        const pem = jsrsasignUtil.readFile(__dirname.replace(/dist[\S]*/g, '') + 'private-key.pem')
        const privateKey = jsrsasign.KEYUTIL.getKey(pem) as jsrsasign.RSAKey;
        const accessToken = jsrsasign.KJUR.jws.JWS.sign(header.alg, JSON.stringify(header), JSON.stringify(payload), privateKey)
        const returnJson = {
            access_token: accessToken,
            token_type: 'Bearer',
            refresh_token: undefined,
            id_token: undefined,
            scope: clientAuthDto.scope
        }
        if (scope.includes('offline_access')) {
            const refreshToken = Math.random().toString(36).slice(-12);
            await prismaServie.refreshToken.create({
                data: {
                    client_id: clientId,
                    refresh_token: refreshToken,
                    scope: clientAuthDto.scope.split(' '),
                    user: {
                        connect: { sub: userData.sub }
                    }
                }
            })
            returnJson.refresh_token = refreshToken;
        }
        if (scope.includes('openid')) {
            const iHeader = {
                typ: 'JWT',
                alg: 'RS256',
                kid: 'authServer'
            }
            const iPayload = {
                iss: 'http://localhost:9001',
                sub: userData.sub,
                aud: clientAuthDto.client_id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (5 * 60),
            }
            const idToken = jsrsasign.KJUR.jws.JWS.sign(
                iHeader.alg,
                JSON.stringify(iHeader),
                JSON.stringify(iPayload),
                privateKey
            )
            returnJson.id_token = idToken
        }
        return returnJson;
    }
}
