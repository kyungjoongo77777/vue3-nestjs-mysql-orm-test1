export interface FileDto {
    fileName: string;
    originalFileName?: string;
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