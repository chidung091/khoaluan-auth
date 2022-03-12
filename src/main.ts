import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { MICROSERVICE_HOST } from './config/secrets'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api/')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: MICROSERVICE_HOST,
      port: 4002,
    },
  })
  setUpSwagger(app)
  app.enableCors()
  await app.startAllMicroservices()
  await app.listen(3002)
  Logger.log('Auth microservice started')
}

function setUpSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Point Authentication System')
    .setDescription(
      `API specification for Thanh Huyen Point Authentication System.`,
    )
    .setVersion('0.1.2')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
    customSiteTitle: 'Point Authentication System',
  })
}

bootstrap()
