import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadInterface } from "./interfaces/payload.interface";
import { JWT_SECRET_KEY } from "../../constants/backend.constants";

@Injectable()
export class PassportJwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: JWT_SECRET_KEY
        });
    }

    async validate(payload: PayloadInterface) {
        let result = { userId: payload.userId, fullName: payload.fullName };
        return result;
    }

}
