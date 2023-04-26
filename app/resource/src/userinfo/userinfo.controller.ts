import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthContext } from 'src/auth/auth.decorator';
import { ScopeGuard } from 'src/scope/scope.guard';
import prismaServie from '~/prisma';

type UserInfo = {
    userId: string;
    name?: string;
    email?: string;
    address?: string;
    phone_number?: string;
}
@Controller('userinfo')
export class UserinfoController {
    @Get()
    @UseGuards(new ScopeGuard('openid'))
    async getUserInfo(@AuthContext() authContext: AuthContext, @Res() res: Response) {
        const scopeList = authContext.scope;
        const user = await prismaServie.user.findFirst({ where: { sub: authContext.userId } })
        const userInfo: UserInfo = {
            userId: authContext.userId
        }
        if (scopeList.includes('profile')) {
            userInfo.name = user.name
        }
        if (scopeList.includes('email')) {
            userInfo.email = user.email
        }
        if (scopeList.includes('address')) {
            userInfo.address = user.address;
        }
        if (scopeList.includes('phone')) {
            userInfo.phone_number = user.phone_number;
        }
        return res.status(200).json(userInfo);
    }
}
