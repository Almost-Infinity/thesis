import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class RegistryService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
        { phone: createUserDto.phone },
        { passport: createUserDto.passport },
        { tax_id: createUserDto.tax_id }
      ]
    }).exec();

    if (user) {
      throw new ConflictException("User with this phone or passport or tax id already exists!");
    }

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    return createdUser.toJSON();
  }

  async getById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException("User with this id not found!");
    }

    return user.toJSON();
  }

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => user.toJSON());
  }
}
