import { Column } from "typeorm";

export interface FileDto {
    fileName: string;
    createdDt: string;
    fileSize: string;
    owners: string;
    fileType: string;
    fileLocation: string;
    folderName: string;
    isFolder: boolean,
    isTrash: false,
}