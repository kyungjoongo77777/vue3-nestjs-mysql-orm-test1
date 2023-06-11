import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileModule } from "./file/file.module";
import { connOptions } from "./ormconfig";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { join } from "path";
import { FILE_UPLOAD_DIR } from "./constants/backend.constants";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        // @ts-ignore
        TypeOrmModule.forRoot(connOptions),
        UserModule,
        AuthModule,
        FileModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", FILE_UPLOAD_DIR)
        })

    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
