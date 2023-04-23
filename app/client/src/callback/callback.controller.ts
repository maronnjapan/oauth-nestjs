import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';

export type TokenType = {
    access_token: string;
    token_type: 'Bearer';
    refresh_token?: string;
    scope: string;
    id_token: string;
}


@Controller('callback')
export class CallbackController {
    @Get()
    async getCode(@Query('code') code: string, @Query('state') state: string, @Query('scope') scope: string, @Req() req: Request, @Res() res: Response) {
        if (!code) {
            return res.render('error', { error: 'invalid_callback' })
        }

        const sessionState = req.session.state;
        req.session.state = null;
        if (!state || sessionState !== state) {
            return res.render('error', { error: 'invalid_callback' })
        }
        const formData = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: Config.getRedirectUris()[0],
            scope,
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Config.getEncodeClientCredentials()
        }

        try {
            const response: AxiosResponse<TokenType> = await axios.post(Config.getTokenEndpoint(), formData, { headers: headers });
            const { data } = response;
            req.session.access_token = data.access_token;
            req.session.refresh_token = data.refresh_token;
            if (data.id_token) {
                const getPublicKeyResponse: AxiosResponse = await axios.get('http://localhost:3001/token/public-key')

            }
            return res.render('index', { access_token: data.access_token, scope: data.scope, refresh_token: data.refresh_token, id_token: data.id_token })
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                const error = e.response.data;
                return res.render('error', error)
            }
            return res.render('error', { error: '予期せぬエラーが発生しました' })
        }


    }
}
