import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Model, Types } from "mongoose";
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

  async deleteById(userIds: string[]): Promise<User[]> {
    const objectIds = userIds.map((id) => Types.ObjectId.createFromHexString(id));
    await this.userModel.deleteMany({ _id: { $in: objectIds } });
    return this.getAll();
  }

  async updateById(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException("User with this id not found!");
    }

    await this.userModel.findByIdAndUpdate(userId, updateUserDto);

    return this.getById(userId);
  }

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => user.toJSON());
  }
}
