import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import _ from "lodash";
import { PayloadInterface } from "./security/interfaces/payload.interface";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { UserDto } from "../user/user.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async loginAndResponseAccessToken(pUserId: string, pUserPwd: string): Promise<any> {
        const userOne: UserDto = await this.userService.findByUserId(pUserId);

        //todo: user가 존재 하는 경우.
        if (!_.isEmpty(userOne)) {
            let encryptedPassword = userOne.userPwd;
            const isMatch = await bcrypt.compare(pUserPwd, encryptedPassword);
            //todo: id, pwd 가 일치 하지 않는 경우..
            if (!isMatch) {
                return {
                    "ok": false,
                    "status": 401,
                    "result": "401 unauthorized"
                };
            } else { //todo: id, pwd 가 일치하는 경우...
                let _accessToken = this.jwtService.sign({
                    userId: userOne.userId,
                    sub: userOne.fullName
                });
                let userDataOne: UserDto = {
                    userId: pUserId,
                    accessToken: _accessToken
                };

                await this.userService.updateUserAccessToken(userDataOne);
                return {
                    "ok": true,
                    "status": 200,
                    accessToken: _accessToken
                };
            }
        } else {
            return {
                "ok": false,
                "status": 401,
                "result": "401 unauthorized"
            };
        }
    }

}


