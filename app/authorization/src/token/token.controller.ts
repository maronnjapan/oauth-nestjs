import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Config } from 'src/config/Config';
import prismaServie from '~/prisma';
import { ClientAuthDto } from './dto/client-auth.dto';
import { TokenService } from './token.service';
import { createHash } from 'crypto';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }
    @Get('public-key')
    getPublicKey() {
        return this.tokenService.getPublicKey();
    }
    @Post()
    async publishToken(@Headers('Authorization') auth: string, @Body() clientAuthDto: ClientAuthDto, @Res() res: Response) {

        if (clientAuthDto.grant_type === 'client_credentials') {
            const { clientId } = this.tokenService.getResourceInfo(auth, clientAuthDto.scope);
            const tokenResponse = await this.tokenService.createToken(clientAuthDto, clientId);

            return !clientId ? res.status(401).json({ error: 'invalid_client' }) : res.status(200).json({ access_token: tokenResponse.access_token, scope: tokenResponse.scope, token_type: tokenResponse.token_type });

        }

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
            const authorizeData = await prismaServie.code.findFirst({ where: { code: clientAuthDto.code }, include: { user: true, code_challenge: true } })
            await prismaServie.code.delete({ where: { code: authorizeData.code } })
            if (!authorizeData) {
                return res.status(400).json({ error: 'invalid_grant' })
            }

            const codeChallenge = authorizeData.code_challenge.code_challenge_method === 's256' ? Buffer.from(createHash('sha256').update(clientAuthDto.code_verifier).digest('base64')).toString('base64') : clientAuthDto.code_verifier;
            if (authorizeData.code_challenge.code_challenge !== codeChallenge) {
                return res.status(400).json({ error: 'invalid_request' });
            }


            if (authorizeData.client_id === clientId) {
                const tokenResponse = await this.tokenService.createToken(clientAuthDto, authorizeData.client_id, authorizeData.user);
                return res.status(201).json(tokenResponse);
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
            const tokenResponse = await this.tokenService.createToken(clientAuthDto, authorizeData.client_id, authorizeData.user);

            return res.status(201).json(tokenResponse);
        }

        return res.status(400).json({ error: 'unsupported_grant_type' })


    }
}
