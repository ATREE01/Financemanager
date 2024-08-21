import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

function execSeed(type: string, seederService: SeederService) {
  switch (type) {
    case 'currency':
      return seederService.seedCurrency();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  const seederService = app.get(SeederService);
  const type = process.argv[2];
  if (!type) console.log('Please provide a type of seeder to run');
  try {
    await execSeed(type, seederService);
    console.log('Seed completed');
  } catch (e) {
    console.log(e);
  } finally {
    await app.close();
  }
}
bootstrap();
