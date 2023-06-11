import { Body, Controller, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../user/user.dto";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {

    constructor(private readonly userService: UserService, private readonly authService: AuthService, private jwtService: JwtService) {
    }

    /**
     * todo: 로그인 success 후에 accessToken을 응답해준다..
     * @param userDto
     */
    @Post("/login")
    async login(@Body() userDto: UserDto): Promise<any> {
        return await this.authService.loginAndResponseAccessToken(userDto.userId, userDto.userPwd);
    }
    /**
     * todo:   fetch userInfo with accessToken
     * @param req
     */
    @Post("/getUserInfoWithToken")
    async getUserInfoWithToken(@Req() req: any): Promise<any> {
        try {
            const accessToken: any = req.body.accessToken;
            let result = await this.userService.findByUserAccessToken(accessToken);
            return result;
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }
    }
}
