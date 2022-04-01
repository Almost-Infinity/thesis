import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RegistryController } from "./registry.controller";
import { RegistryService } from "./registry.service";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [RegistryController],
  providers: [RegistryService]
})
export class RegistryModule {
}
