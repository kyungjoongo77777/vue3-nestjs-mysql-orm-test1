import { Column } from "typeorm";

export interface FileDto {
    fileName: string;
    createdDt: string;
    fileSize: string;
    owner: string;
    sharedUsers?: string;
    fileType: string;
    fileLocation: string;
    folderName: string;
    isFolder: boolean;
    isTrash: false;
}