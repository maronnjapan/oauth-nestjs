import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const path = __dirname.replace(/dist[\s\S]*/g, 'dist')
  app.useStaticAssets(join(path, '..', 'public'));
  app.setBaseViewsDir(join(path, '..', 'views'));
  app.setViewEngine('hbs')

  await app.listen(3001);
}
bootstrap();
