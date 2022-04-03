import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ParseObjectIdPipe } from "../../pipes/parse-object-id.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { DeleteUsersDto } from "./dto/delete-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RegistryService } from "./registry.service";

@Controller("registry")
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {
  }

  @Post("/")
  create(@Body() createUserDto: CreateUserDto) {
    return this.registryService.create(createUserDto);
  }

  @Get(":userId")
  getById(@Param("userId", ParseObjectIdPipe) userId: string) {
    return this.registryService.getById(userId);
  }

  @Delete("delete")
  deleteById(@Body() deleteUsersDto: DeleteUsersDto) {
    return this.registryService.deleteById(deleteUsersDto.userIds);
  }

  @Patch(":userId")
  updateById(@Param("userId", ParseObjectIdPipe) userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.registryService.updateById(userId, updateUserDto);
  }

  @Get("/")
  getAll() {
    return this.registryService.getAll();
  }
}
