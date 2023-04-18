import { Body, Controller, Delete, Get, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthContext } from 'src/auth/auth.decorator';
import { ScopeGuard } from 'src/scope/scope.guard';
import prismaServie from '~/prisma';

@Controller('resource')
export class ResourceController {
        @Get()
        async giveJsonData(@Req() req: Request, @Res() res: Response) {

                return res.json(req.body)
        }


        @Get('read')
        @UseGuards(new ScopeGuard([{ scopeName: 'read' }]))
        async getWords(@Res() res: Response) {
                const words = await prismaServie.words.findMany();
                return res.json({ words: words.map((word) => word.val) });
        }

        @Post()
        @UseGuards(new ScopeGuard([{ scopeName: 'write' }]))
        async addWord(@Body() wordDto: { addWord: string }, @Res() res: Response) {
                await prismaServie.words.create({ data: { val: wordDto.addWord } });
                return res.status(201).json({});
        }

        @Delete()
        @UseGuards(new ScopeGuard([{ scopeName: 'write' }, { scopeName: 'delete' }]))
        async deleteWord(@Res() res: Response) {
                const word = await prismaServie.words.findFirst();
                await prismaServie.words.delete({ where: { id: word.id } })
                return res.status(202).json({});
        }
}
