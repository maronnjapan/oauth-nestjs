import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

declare module 'express-session' {
  interface SessionData {
    login_user_id: { id: string }
  }
}


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
      secret: 'my-secret2',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  const path = __dirname.replace(/dist[\s\S]*/g, 'dist')
  app.useStaticAssets(join(path, '..', 'public'));
  app.setBaseViewsDir(join(path, '..', 'views'));
  app.setViewEngine('hbs')

  await app.listen(3001);
}
bootstrap();
