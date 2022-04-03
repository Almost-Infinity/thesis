import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RegistryModule } from "./modules/registry/registry.module";
import { UsersSeed } from "./modules/registry/seeds/users.seed";

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost/thesis"), RegistryModule],
  providers: [UsersSeed],
  exports: [UsersSeed]
})
export class SeedsModule {
}
