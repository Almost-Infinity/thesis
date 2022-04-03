import { NAME_REGEXP, PASSPORT_REGEXP, PHONE_REGEXP } from "@thesis/api-interfaces";
import { IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: "First name must be a string!" })
  @Length(2, 45, { message: "First name length must be 2-45 chars" })
  @Matches(NAME_REGEXP, { message: "First name must contain only english letters A-Z, a-z" })
  first_name: string;

  @IsString({ message: "Last name must be a string!" })
  @Length(2, 45, { message: "Last name length must be 2-45 chars" })
  @Matches(NAME_REGEXP, { message: "Last name must contain only english letters A-Z, a-z" })
  last_name: string;

  @IsOptional()
  @IsString({ message: "Middle name must be a string!" })
  @Length(2, 45, { message: "Middle name length must be 2-45 chars" })
  @Matches(NAME_REGEXP, { message: "Middle name must contain only english letters A-Z, a-z" })
  middle_name: string;

  @IsString({ message: "Phone must be a string!" })
  @Matches(PHONE_REGEXP, { message: "Phone must match the pattern +380xxxxxxxxx" })
  phone: string;

  @IsString({ message: "Passport must be a string!" })
  @Matches(PASSPORT_REGEXP, { message: "Passport must be a 9 numbers string" })
  passport: string;

  @IsString({ message: "Address must be a string!" })
  @MaxLength(128, { message: "Passport must be less than 128 chars" })
  address: string;
}
