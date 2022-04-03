import { NestFactory } from "@nestjs/core";
import { UsersSeed } from "./modules/registry/seeds/users.seed";
import { SeedsModule } from "./seeds.module";

async function bootstrap() {
  NestFactory.createApplicationContext(SeedsModule)
    .then((appContext) => {
      appContext.get(UsersSeed).seed()
        .then(() => console.log("Seeding complete!"))
        .catch(error => {
          console.log("Seeding failed!");
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
}

bootstrap();
