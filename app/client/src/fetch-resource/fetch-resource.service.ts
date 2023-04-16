import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import { TokenType } from 'src/callback/callback.controller';
import { Config } from 'src/config/Config';


@Injectable()
export class FetchResourceService {

    async fetchGetResource<T>(resourceEndpoint: string, accessToken: string, refreshToken: string, req: Request) {
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        }
        try {
            const axiosRes: AxiosResponse<T> = await axios.get(resourceEndpoint, { headers })
            return { data: axiosRes.data, isSuccess: true };

        } catch (e) {
            try {
                const refreshAccessToken = await this.getRefreshAccessToken(refreshToken,req)
                headers.Authorization = 'Bearer ' + refreshAccessToken;
                const axiosRes: AxiosResponse<T> = await axios.get(resourceEndpoint, { headers })
                return { data: axiosRes.data, isSuccess: true };
            } catch (e) {
                return { isSuccess: false }
            }

        }
    }
    async fetchPostResource<T>(resourceEndpoint: string, accessToken: string, requestData: object, refreshToken: string, req: Request) {
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        }
        try {
            const axiosRes: AxiosResponse<T> = await axios.post(resourceEndpoint, requestData, { headers })
            return { data: axiosRes.data, isSuccess: true };

        } catch (e) {

           try {
                const refreshAccessToken = await this.getRefreshAccessToken(refreshToken,req)
                headers.Authorization = 'Bearer ' + refreshAccessToken;
                const axiosRes: AxiosResponse<T> = await axios.post(resourceEndpoint, requestData, { headers })
                return { data: axiosRes.data, isSuccess: true };
            } catch (e) {
                return { isSuccess: false }
            }

        }
    }

    async fetchDeleteResource<T>(resourceEndpoint: string, accessToken: string, refreshToken: string, req: Request) {
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        }
        try {
            const axiosRes: AxiosResponse<T> = await axios.delete(resourceEndpoint, { headers })
            return { data: axiosRes.data, isSuccess: true };

        } catch (e) {
            try {
                const refreshAccessToken = await this.getRefreshAccessToken(refreshToken,req)
                headers.Authorization = 'Bearer ' + refreshAccessToken;
                const axiosRes: AxiosResponse<T> = await axios.delete(resourceEndpoint,{ headers })
                return { data: axiosRes.data, isSuccess: true };
            } catch (e) {
                return { isSuccess: false }
            }

        }
    }

    async getRefreshAccessToken(refreshToken: string, req: Request) {
        const formData = {
            grant_type: 'refresh_token',
            redirect_uri: Config.getRedirectUris()[0],
            refresh_token:refreshToken
        }

        const tokenHeader = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Config.getEncodeClientCredentials()
        }
        try{
            const reAxiosRes: AxiosResponse<TokenType> = await axios.post(Config.getTokenEndpoint(), formData, { headers: tokenHeader })
            req.session.access_token = reAxiosRes.data.access_token;
            req.session.refresh_token = reAxiosRes.data.refresh_token;
            return reAxiosRes.data.access_token;
        }catch(e){
            throw new UnauthorizedException();
        }
    }
}
