import { Injectable } from '@nestjs/common';
import { Authorize, User } from '@prisma/client';
import prismaServie from '~/prisma';
import { ApproveDto } from './dto/approve.dto';

type Options = {
    code?: string;
    state?: string;
    error?: string;
    scope?: string;
}

@Injectable()
export class AuthorizeService {
    buildUrl(base: string, options: Options, hash?: string) {
        const newUrl = new URL(base);

        const urlSearchParam = new URLSearchParams(options).toString();

        newUrl.search = urlSearchParam;
        if (hash) {
            newUrl.hash = hash;
        }

        return newUrl.toString();
    }

    async getRedirectUrl(responseType: string, clientId: string, redirectUrl: string, state: string, scope: string[], codeChallenge: string, user: User, deny?: string) {

        if (deny) {
            return this.buildUrl(redirectUrl, {
                error: 'access_denied'
            })

        }


        if (responseType === 'code') {

            const codeData = await this.registerAuthorizeCode(clientId, user.sub, codeChallenge)

            return this.buildUrl(redirectUrl, {
                code: codeData.code,
                state: state,
                scope: scope.join(' ')
            })
        }

        return this.buildUrl(redirectUrl, {
            error: 'unsupported_response_type'
        })

    }

    async registerAuthorizeCode(clientId: string, userId: string, codeChallenge: string) {
        const code = Math.random().toString(36).slice(-10);
        return await prismaServie.code.create({
            data: {
                code: code,
                client_id: clientId,
                user: {
                    connect: { sub: userId }
                },
                code_challenge: {
                    connect: { code_challenge: codeChallenge }
                }
            }
        })
    }
}
