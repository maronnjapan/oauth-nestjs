import { Controller, Get, UseGuards } from '@nestjs/common';
import { ScopeGuard } from 'src/scope/scope.guard';

@Controller('userinfo')
export class UserinfoController {
    @Get()
    @UseGuards(new ScopeGuard([{ scopeName: 'openid' }]))
    async getUserInfo() {
        return
    }
}
