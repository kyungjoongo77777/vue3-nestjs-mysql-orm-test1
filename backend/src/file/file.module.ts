import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { FileEntity } from "./file.entity";
import { MulterModule } from "@nestjs/platform-express";
import { FILE_UPLOAD_DIR } from "../constants/backend.constants";


@Module({
    imports: [
        TypeOrmModule.forFeature([FileEntity]),
        MulterModule.register({
            dest: FILE_UPLOAD_DIR,
        })

    ],
    controllers: [FileController],
    providers: [FileService]
})
export class FileModule {
}
