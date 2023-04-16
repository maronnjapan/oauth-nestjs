import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Config } from 'src/config/Config';
import prismaServie from '~/prisma';
import { ClientAuthDto } from './dto/client-auth.dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }
    @Get('public-key')
    getPublicKey() {
        return this.tokenService.getPublicKey();
    }
    @Post()
    async publishToken(@Headers('Authorization') auth: string, @Body() clientAuthDto: ClientAuthDto, @Res() res: Response) {


        const { clientId, clientSecret } = this.tokenService.getClientInfo(clientAuthDto, auth);

        if (!clientId) {
            return res.status(401).json({ error: 'invalid_client' });
        }
        const client = Config.getClients().find((data) => data.client_id === clientId);
        if (!client) {
            return res.status(401).json({ error: 'invalid_client' });
        }

        if (client.client_secret !== clientSecret) {
            return res.status(401).json({ error: 'invalid_client' });
        }

        if (clientAuthDto.grant_type === 'authorization_code') {
            const authorizeData = await prismaServie.code.findFirst({ where: { code: clientAuthDto.code }, include: { user: true } })
            await prismaServie.code.delete({ where: { code: authorizeData.code } })

            if (!authorizeData) {
                return res.status(400).json({ error: 'invalid_grant' })
            }

            if (authorizeData.client_id === clientId) {
                const tokenResponse = await this.tokenService.createToken(clientAuthDto, authorizeData.user);

                return res.status(200).json(tokenResponse);
            } else {
                return res.status(400).json({ error: 'invalid_grant' });
            }
        } else if (clientAuthDto.grant_type === 'refresh_token') {
            const authorizeData = await prismaServie.refreshToken.findFirstOrThrow({ where: { refresh_token: clientAuthDto.refresh_token }, include: { user: true } })
            await prismaServie.refreshToken.delete({ where: { refresh_token: authorizeData.refresh_token } })

            if (!authorizeData) {
                return res.status(400).json({ error: 'invalid_grant' })
            }
            clientAuthDto.scope = authorizeData.scope.join(' ')
            const tokenResponse = await this.tokenService.createToken(clientAuthDto, authorizeData.user);

            return res.status(200).json(tokenResponse);
        }

        return res.status(400).json({ error: 'unsupported_grant_type' })


    }
}
