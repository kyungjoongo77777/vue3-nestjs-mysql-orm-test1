import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserDto } from "./user.dto";
import * as bcrypt from "bcrypt";
import { SALT_OR_ROUNDS } from "../constants/backend.constants";
import _ from "lodash";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {
    }

    async getAll() {
        return await this.usersRepository.find();
    }

    async insertOne(userDto: UserDto) {
        const user = this.usersRepository.create(userDto);
        await this.usersRepository.save(userDto);
        return user;
    }

    async createWithEncryptPassword(userDto: UserDto): Promise<any> {
        const _hashedPassword = await bcrypt.hash(userDto.userPwd, SALT_OR_ROUNDS);
        userDto.userPwd = _hashedPassword;
        const user = this.usersRepository.create(userDto);
        await this.usersRepository.save(userDto);
        return user;
    }

    async findOne(id: number) {
        return await this.usersRepository.findOne({ where: { id: id } });
    }

    async findByUserId(userId: string) {
        return await this.usersRepository.findOne({ where: { userId: userId } });
    }

    async findByUserAccessToken(accessToken: string) {
        return await this.usersRepository.findOne({ where: { accessToken: accessToken } });
    }

    async updateUserAccessToken(userDto: Partial<UserDto>) {
        await this.usersRepository.update({
            userId: userDto.userId
        }, userDto);
        return await this.usersRepository.findOne({ where: { userId: userDto.userId } });
    }

    async updateOne(id: number, userDto: Partial<UserDto>) {
        let result = await this.usersRepository.update({ id }, userDto);
        console.log("update===>", result);
        return await this.usersRepository.findOne({ where: { id: id } });
    }

    async deleteOne(id: number) {
        await this.usersRepository.delete({ id });
        return { deleted: true };
    }
}
