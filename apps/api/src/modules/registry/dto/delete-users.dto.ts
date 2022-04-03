import { IsArray } from "class-validator";

export class DeleteUsersDto {
  @IsArray()
  userIds: string[];
}
