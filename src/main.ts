import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dataSource from 'db/data-source';
import * as session from 'express-session';
import * as passport from 'passport';
import { SessionEntity } from './session.entity';
import { TypeormStore } from 'connect-typeorm';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  await dataSource.initialize();
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Vinyl Records Store API')
    .setDescription('API documentation for the Vinyl Records Store project')
    .setVersion('1.0')
    .addBearerAuth()
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          scopes: {
            profile: 'Access your profile',
            email: 'Access your email',
          },
        },
      },
    })
    .addServer('http://localhost:3000/api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/api/auth/google/redirect',
    },
  });

  app.setGlobalPrefix('api');
  const sessionRepository = dataSource.getRepository(SessionEntity);
  app.use(
    session({
      secret: 'asdfasdasdasdasdsadasfDASDSAFsadsadasdsad2qedsasdsad',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3000000,
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 3000,'0.0.0.0');
}
bootstrap();
