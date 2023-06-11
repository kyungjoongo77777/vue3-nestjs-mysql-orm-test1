import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("file",{
    orderBy: {
        id: "DESC"
    }
})
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    createdDt: string;

    @Column()
    fileSize: string;

    @Column()
    owners: string;

    @Column()
    fileType: string;

    @Column()
    fileLocation: string;

    @Column()
    folderName: string;

    @Column()
    isFolder: boolean;

    @Column()
    isTrash: boolean;
}