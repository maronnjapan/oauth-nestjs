import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';
import { AuthorizeService } from './authorize.service';
import prismaServie from '~/prisma';
import { createHash } from 'crypto';

@Controller('/authorize')
export class AuthorizeController {
    constructor(private authorizeService: AuthorizeService) { }
    @Get()
    redirectAuthServe(@Req() req: Request, @Res() res: Response) {
        const state = Math.random().toString(36).slice(-8)
        req.session.state = state
        const codeVerifier = [...Array(6)].map(() => Math.random().toString(36)).join('')
        req.session.code_verifier = codeVerifier;
        const codeChallenge = Buffer.from(createHash('sha256').update(codeVerifier).digest('base64')).toString('base64');
        const authorizeUrl = this.authorizeService.buildUrl(Config.getAuthorizationEndpoint(), {
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            redirect_uri: Config.getRedirectUris()[0],
            state,
            scope: 'openid profile email address phone offline_access',
            prompt: 'consent',
            code_challenge: codeChallenge,
            code_challenge_method: 's256'
        })
        return res.redirect(authorizeUrl);

    }

}
