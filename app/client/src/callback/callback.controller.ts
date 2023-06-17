import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';
import { CallbackService } from './callback.service';
import * as jsrsasign from 'jsrsasign';
import * as jsrsasignUtil from 'jsrsasign-util';
import { UserInfo } from 'src/main';

export type TokenType = {
    access_token: string;
    token_type: 'Bearer';
    refresh_token?: string;
    scope: string;
    id_token: string;
}


@Controller('callback')
export class CallbackController {
    constructor(private callBackService: CallbackService) { }
    @Get()
    async getCode(@Query('code') code: string, @Query('state') state: string, @Query('scope') scope: string, @Req() req: Request, @Res() res: Response) {
        if (!code) {
            return res.render('error', { error: 'invalid_callback' })
        }

        const sessionState = req.session.state
        req.session.state = null
        const codeVerifier = req.session.code_verifier;
        req.session.code_verifier = null

        if (!state || sessionState !== state) {
            return res.render('error', { error: 'invalid_callback' })
        }
        const formData = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: Config.getRedirectUris()[0],
            scope,
            code_verifier: codeVerifier
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Config.getEncodeClientCredentials()
        }

        try {
            const response: AxiosResponse<TokenType> = await axios.post(Config.getTokenEndpoint(), formData, { headers: headers });
            const { data } = response;
            const getPublicKeyResponse: AxiosResponse = await axios.get('http://localhost:3001/token/public-key')
            const publicKey = jsrsasign.KEYUTIL.getKey(getPublicKeyResponse.data) as jsrsasign.RSAKey
            const isCorrectIdToken = this.callBackService.validateIdToken(data.id_token, publicKey)
            if (isCorrectIdToken) {
                req.session.access_token = data.access_token;
                req.session.refresh_token = data.refresh_token;
                const bearerHader = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + data.access_token
                }
                const userInfoRes: AxiosResponse<UserInfo> = await axios.get(Config.getUserInfoEndpoinst(), { headers: bearerHader });
                req.session.user_info = userInfoRes.data;
                return res.render('index', { access_token: data.access_token, scope: data.scope, refresh_token: data.refresh_token, id_token: data.id_token, user_info: JSON.stringify(userInfoRes.data) })
            }
            req.session.access_token = null;
            req.session.refresh_token = null;
            return res.render('error', { error: '不正な認証です。' })
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                const error = e.response.data;
                return res.render('error', error)
            }
            return res.render('error', { error: '予期せぬエラーが発生しました' })
        }


    }
}
