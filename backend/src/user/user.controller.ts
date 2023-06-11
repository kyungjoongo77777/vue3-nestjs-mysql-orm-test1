import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";

@Controller("/user")
export class UserController {
    constructor(private usersService: UserService) {
    }

    @Get()
    async getUsers() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.usersService.getAll()
        };
    }

    /**
     * todo: 암호화 없이 유저 등록 for test
     * @param userDto
     */
    @Post()
    async createUsers(@Body() userDto: UserDto) {
        return {
            statusCode: HttpStatus.OK,
            message: "User added successfully",
            data: await this.usersService.insertOne(userDto)
        };
    }

    /**
     * todo: pwd 암호화해서 회원 가입
     * @param userDto
     */
    @Post("/createUserWithEncryptPassword")
    async createUserWithEncryptPassword(@Body() userDto: UserDto) {
        return {
            statusCode: HttpStatus.OK,
            message: "User added successfully",
            data: await this.usersService.createWithEncryptPassword(userDto)
        };
    }

    @Get(":id")
    async getUserOne(@Param("id") id: number) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.usersService.findOne(id)
        };
    }

    @Put(":id")
    async updateUserOne(@Param("id") id: number, @Body() userDto: Partial<UserDto>) {
        return {
            statusCode: HttpStatus.OK,
            message: "User update successfully",
            data: await this.usersService.updateOne(id, userDto)
        };
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: number) {
        await this.usersService.deleteOne(id);
        return {
            statusCode: HttpStatus.OK,
            message: "User deleted successfully"
        };
    }

    //   @Get(':firstName')
    //   async readUserByFirstName(@Param('firstName') firstName: string) {
    //     return {
    //       statusCode: HttpStatus.OK,
    //       data: await this.usersService.findByfirstName(firstName),
    //     };
    //   }
}
