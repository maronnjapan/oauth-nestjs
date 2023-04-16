import { Controller, Get, Headers, Query, Render, Req, Res } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { Config } from 'src/config/Config';
import { FetchResourceService } from './fetch-resource.service';

type ResourceData = {
    words: string[]
}
@Controller('fetch-resource')
export class FetchResourceController {
    constructor(private fetchResourceService: FetchResourceService) {

    }
    @Get()
    @Render('resource')
    async index() {
        return;
        // const accessToken = req.session.access_token;

        // const headers = {
        //     'Authorization': 'Bearer ' + accessToken
        // }

        // try {
        //     const axiosRes: AxiosResponse<ResourceData> = await axios.get(Config.getResourceEndpoinst(), { headers: headers })
        //     return res.render('resourceData', { data: JSON.stringify(axiosRes.data) });

        // } catch (e) {

        //         if (axios.isAxiosError(e) && e.response) {
        //             const error = e.response.data;
        //             return res.render('error', error)
        //         }
        //         return res.render('error', { error: '予期せぬエラーが発生しました' })

        // }


    }

    @Get('read')
    async getWords(@Req() req: Request, @Res() res: Response) {
        const responseData = await this.fetchResourceService.fetchGetResource<ResourceData>(Config.getResourceEndpoinst() + '/read', req.session.access_token,req.session.refresh_token,req);
        const statusData = responseData.isSuccess ? { readSuccess: true } : { readFail: true };
        return res.render('resource', {words:responseData.data?.words,...statusData})
    }

    @Get('add')
    async addWords(@Query('word') addWord: string, @Req() req: Request, @Res() res: Response) {
        const responseData = await this.fetchResourceService.fetchPostResource<ResourceData>(Config.getResourceEndpoinst(), req.session.access_token, { addWord },req.session.refresh_token,req)
        const statusData = responseData.isSuccess ? { addSuccess: true } : { addFail: true };
        return res.render('resource', statusData)
    }

    @Get('delete')
    async deleteWord(@Req() req: Request, @Res() res: Response) {
        const responseData = await this.fetchResourceService.fetchDeleteResource<ResourceData>(Config.getResourceEndpoinst(), req.session.access_token,req.session.refresh_token,req);
        const statusData = responseData.isSuccess ? { deleteSuccess: true } : { deleteFail: true };
        return res.render('resource', statusData)
    }
}
