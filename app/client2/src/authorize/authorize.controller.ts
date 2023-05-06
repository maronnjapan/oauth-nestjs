import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';
import { AuthorizeService } from './authorize.service';
import prismaServie from '~/prisma';

@Controller('/authorize')
export class AuthorizeController {
    constructor(private authorizeService: AuthorizeService) { }
    @Get()
    redirectAuthServe(@Req() req: Request, @Res() res: Response) {
        const state = Math.random().toString(36).slice(-8)
        req.session.state = state
        const authorizeUrl = this.authorizeService.buildUrl(Config.getAuthorizationEndpoint(), {
            response_type: 'code',
            client_id: process.env.CLIENT2_ID,
            redirect_uri: Config.getRedirectUris()[0],
            state,
            scope: 'openid profile email address phone offline_access',
            prompt: 'consent'
        })
        return res.redirect(authorizeUrl);

    }

}
