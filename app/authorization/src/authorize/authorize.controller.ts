import { Body, Controller, Get, Post, Query, Render, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';
import { AuthorizeService } from './authorize.service';
import prismaServie from '~/prisma';
import { ApproveDto } from './dto/approve.dto';

type ResponseType = 'code';
@Controller('authorize')
export class AuthorizeController {

    constructor(private authorizeService: AuthorizeService) { }

    @Get()
    async showApprove(@Query('client_id') clientId: string, @Query('redirect_uri') redirectUri: string, @Query('response_type') responseType: ResponseType, @Query('state') state: string, @Query('scope') scope: string, @Query('prompt') prompt: string, @Res() res: Response) {
        const client = Config.getClients().find((data) => data.client_id === clientId)
        if (!client) {
            return res.render('error', { error: 'Unknown Client' })
        }
        if (!client.redirect_uris.includes(redirectUri)) {
            return res.render('error', { error: 'Invalid Redirect URI' })
        }
        if (!scope) {
            return res.render('error', { error: 'Invalid Scope' });
        }
        const scopeList = scope.split(' ')
        const filterScope = scopeList.filter((data) => client.scope.includes(data));
        if (!scopeList.length || scopeList.length !== filterScope.length) {
            return res.render('error', { error: 'Invalid Scope' })
        }


        const reqId = Math.random().toString(36).slice(-10);
        await prismaServie.authorize.create({
            data: {
                reqId: reqId,
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: responseType,
                state,
            }
        })

        if (scopeList.includes('offline_access') && prompt !== 'consent') {
            const filterScopeList = scopeList.filter((scope) => scope !== 'offline_access');
            return res.render('approve', { client: client, reqid: reqId, scope: filterScopeList })

        }

        return res.render('approve', { client: client, reqid: reqId, scope: scopeList })
    }

    @Post()
    async giveAuthorizeCode(@Body() approveDto: ApproveDto, @Res() res: Response) {
        const query = await prismaServie.authorize.findUnique({ where: { reqId: approveDto.reqid } })
        await prismaServie.authorize.delete({ where: { reqId: approveDto.reqid } })

        if (!query) {
            return res.render('error', { error: 'No matching authorization request' });
        }
        const client = Config.getClients().find((data) => data.client_id === query.client_id)
        if (!client) {
            return res.render('error', { error: 'Invalid Client' })
        }

        const filterScope = approveDto.scope.filter((data) => client.scope.includes(data));
        if (approveDto.scope.length !== filterScope.length) {
            return res.render('error', { error: 'Invalid Scope' })
        }

        const user = await prismaServie.user.findFirst({ where: { email: approveDto.email, password: approveDto.password } })
        if (!user) {
            return res.render('error', { error: 'No Match User' });
        }

        const redirectUrl = await this.authorizeService.getRedirectUrl(query, approveDto, user)

        return res.redirect(redirectUrl);
    }
}
