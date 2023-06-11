import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PassportJwtStrategy } from "./security/passport.jwt.strategy";
import { AuthController } from "./auth.controller";
import { JWT_SECRET_KEY } from "../constants/backend.constants";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET_KEY
            //signOptions: {
            //expiresIn: "10h" // it will be expired after 10 hours
            //expiresIn: "20d" // it will be expired after 20 days
            //expiresIn: 120 // it will be expired after 120ms
            //expiresIn: "120s" // it will be expired after 120s
            // },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, PassportJwtStrategy]
})
export class AuthModule {
}

