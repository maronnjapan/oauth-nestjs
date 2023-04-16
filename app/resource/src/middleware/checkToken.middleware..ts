import { NextFunction, Request, Response } from "express";
import prismaServie from "~/prisma";

export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ error: 'Invalid Request' });
  }
  const accessToken = authHeader.slice('bearer '.length);
  const data = await prismaServie.accessToken.findFirst({ where: { access_token: accessToken }, include: { access_token_info: true } });
  if (!data) {
    return res.status(401).json({ error: 'Invalid Client' });
  }
  next()
}

