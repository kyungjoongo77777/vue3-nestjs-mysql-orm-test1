import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Req, Res,
    UploadedFile, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FileDto } from "./file.dto";
import { diskStorage } from "multer";
import { FilesInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { Request } from "express";
import { FILE_UPLOAD_DIR } from "../constants/backend.constants";
import { JwtAuthGuard } from "../auth/security/jwt.auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("/file")
export class FileController {
    constructor(private filesService: FileService) {
    }

    @Get()
    async getAll(@Param("owner") owner: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.filesService.getALl(owner)
        };
    }
    /**
     * todo; 파일 업로드 route
     * @param request
     * @param file
     * @param filesDto
     */
    @Post()
    @UseInterceptors(FilesInterceptor("file", 20, {
        storage: diskStorage({
            destination: FILE_UPLOAD_DIR,
            filename(req, file, callback) {             //파일명
                const ext = extname(file.originalname); // 오리지널 네임의 확장자 추출
                const uniqueBaseFilename = Math.random().toString(36).substring(2, 15) + Math.random().toString(23).substring(2, 5);
                callback(null, new Date().getTime() + "_" + uniqueBaseFilename + ext);  //에러처리, 파일명항목(베이스네임+날짜+확장자)
            }
        }),
        limits: { fileSize: 50 * 1024 * 1024 } //todo: 50MB size limit
    }))
    async uploadFile(@Req() request: Request, @UploadedFile() file: Express.Multer.File, @Body() filesDto: FileDto) {
        let uploadResult = undefined;
        for (let i = 0; i < request.files.length; i++) {
            let fileOne = request.files[i];
            const ext = extname(fileOne.originalname).replace(".", "");
            let _uploadedFileInfo: FileDto = {
                fileName: fileOne.filename,
                createdDt: this.filesService.getCurrentDateTime(),
                fileSize: fileOne.size,
                owner: filesDto.owner,
                //sharedUsers: filesDto.owner,
                fileType: ext,
                folderName: filesDto.folderName,
                fileLocation: fileOne.destination,
                isFolder: Boolean(filesDto.isFolder),
                isTrash: false
            };
            uploadResult = await this.filesService.uploadOne(_uploadedFileInfo);
        }
        return {
            statusCode: HttpStatus.OK,
            message: "FileOne upload successfully",
            data: uploadResult
        };
    }


    /**
     * todo: 폴더 생성..
     * @param paramFileData
     */
    @Post("/folder")
    async makeFolder(@Body() paramFileData: FileDto) {
        let _uploadedFileInfo: FileDto = {
            fileName: paramFileData.fileName,
            createdDt: new Date().toLocaleDateString(),
            fileSize: paramFileData.fileSize,
            owner: paramFileData.owner,
            fileType: paramFileData.fileType,
            folderName: paramFileData.folderName,
            fileLocation: paramFileData.fileLocation,
            isFolder: paramFileData.isFolder,
            isTrash: false
        };

        return {
            statusCode: HttpStatus.OK,
            message: "folder created successfully",
            data: await this.filesService.uploadOne(_uploadedFileInfo)
        };
    }
    @Get("/getFileOne/:id")
    async getFileOne(@Param("id") id: number) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.filesService.read(id)
        };
    }


    @Put(":id")
    async updateFileOne(@Param("id") id: number, @Body() data: Partial<FileDto>) {
        return {
            statusCode: HttpStatus.OK,
            message: "FileOne update successfully",
            data: await this.filesService.update(id, data)
        };
    }

    @Delete(":id")
    async deleteFileOne(@Param("id") id: number) {
        await this.filesService.destroy(id);
        return {
            statusCode: HttpStatus.OK,
            message: "FileOne deleted successfully"
        };
    }

}

