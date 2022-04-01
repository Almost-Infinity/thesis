import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RegistryModule } from "./modules/registry/registry.module";

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost/thesis"), RegistryModule]
})
export class AppModule {
}
