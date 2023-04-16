import { Injectable } from '@nestjs/common';
import { Authorize } from '@prisma/client';
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

    async getRedirectUrl(grantData: Authorize, postData: ApproveDto) {

        if (postData.deny === 'Deny') {
            return this.buildUrl(grantData.redirect_uri, {
                error: 'access_denied'
            })

        }

        if (grantData.response_type === 'code') {

            const codeData = await this.registerAuthorizeCode(grantData.client_id, postData.userId)

            return this.buildUrl(grantData.redirect_uri, {
                code: codeData.code,
                state: grantData.state,
                scope: postData.scope.join(' ')
            })
        }

        return this.buildUrl(grantData.redirect_uri, {
            error: 'unsupported_response_type'
        })

    }

    async registerAuthorizeCode(clientId: string, userId: string) {
        const code = Math.random().toString(36).slice(-10);
        return await prismaServie.code.create({
            data: {
                code: code,
                client_id: clientId,
                user: {
                    connect: { sub: userId }
                }
            }
        })

    }
}
