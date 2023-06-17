import { Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { IntrospectService } from './introspect.service';

@Controller('introspect')
export class IntrospectController {
    constructor(private introspectService: IntrospectService) { }
    @Post()
    async tokenCheck(@Headers('Authorization') auth: string, sub: string, @Req() req: Request, @Res() res: Response) {
        const isValidBasic = this.introspectService.isValidResourceInfo(auth);
        if (!isValidBasic) {
            return res.status(401).end();
        }
        const isActive = sub === req.cookies['user_id'] ? true : false;
        if (!isActive) {
            return res.status(200).json({ active: false })
        }
        return res.status(200).json({ active: true })
    }
}
