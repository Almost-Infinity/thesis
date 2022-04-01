import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ParseObjectIdPipe } from "../../pipes/parse-object-id.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { RegistryService } from "./registry.service";

@Controller("registry")
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {
  }

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.registryService.create(createUserDto);
  }

  @Get(":userId")
  getById(@Param("userId", ParseObjectIdPipe) userId: string) {
    return this.registryService.getById(userId);
  }

  @Get("/")
  getAll() {
    return this.registryService.getAll();
  }
}
