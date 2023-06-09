import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    state: string;
    access_token: string;
    refresh_token: string;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  const path = __dirname.replace(/dist[\s\S]*/g, 'dist')
  app.useStaticAssets(join(path, '..', 'public'));
  app.setBaseViewsDir(join(path, '..', 'views'));
  app.setViewEngine('hbs')
  await app.listen(3000);
}
bootstrap();
