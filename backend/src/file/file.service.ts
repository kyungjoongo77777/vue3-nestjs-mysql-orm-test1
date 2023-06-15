import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {FileEntity} from "./file.entity";
import {FileDto} from "./file.dto";
import _ from "lodash";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private filesRepository: Repository<FileEntity>
    ) {
    }


    bytesToSize(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "n/a";
        //@ts-ignore
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) return `${bytes} ${sizes[i]})`;
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }

    async getALl(ownerOne: string) {
        let allFileList: any = await this.filesRepository.find();
        let myFileList = []
        for (let i = 0; i < allFileList.length; i++) {
            let sharedUsers = allFileList[i].sharedUsers?.split(",")
            console.log("sharedUsers===>", sharedUsers);
            if (sharedUsers !== undefined) {
                for (let j = 0; j < sharedUsers.length; j++) {
                    if (sharedUsers[j] === ownerOne) {
                        myFileList.push(allFileList[i]);
                    }
                }
            }
        }

        let _myFileList = [];
        let _shareFileList = [];
        let _trashFileList = [];

        for (let myFileOne of myFileList) {
            let sharedUserList = [];
            if (!_.isEmpty(myFileOne.sharedUsers)) {
                sharedUserList = myFileOne.sharedUsers.split(",");
            }

            //todo; 버린 file 인경우..
            if (myFileOne.isTrash) {
                _trashFileList.push(myFileOne)
            } else if (!myFileOne.isTrash && sharedUserList.length > 1) {//todo sharedFile
                _shareFileList.push(myFileOne)
            } else {//todo: myFile
                _myFileList.push(myFileOne)
            }
        }

        return {
            myFileList : _myFileList,
            shareFileList : _shareFileList,
            trashFileList : _trashFileList,
        };
    }

    async uploadOne(fileDto: FileDto) {
        const clientOne = this.filesRepository.create(fileDto);
        await this.filesRepository.save(fileDto);
        return clientOne;
    }


    async read(id: number) {

        let result = await this.filesRepository.findOne({where: {id: id}});

        return result;
    }

    async update(id: number, fileDto: Partial<FileDto>) {
        await this.filesRepository.update({id}, fileDto);
        return await this.filesRepository.findOne({where: {id: id}});
    }

    async destroy(id: number) {
        await this.filesRepository.delete({id});
        return {deleted: true};
    }


    getCurrentDateTime() {
        let today = new Date();
        let year = today.getFullYear();
        let month = ("0" + (today.getMonth() + 1)).slice(-2);
        let day = ("0" + today.getDate()).slice(-2);
        let dateString = year + "-" + month + "-" + day;

        let hours = ("0" + today.getHours()).slice(-2);
        let minutes = ("0" + today.getMinutes()).slice(-2);
        let seconds = ("0" + today.getSeconds()).slice(-2);
        let timeString = hours + ":" + minutes + ":" + seconds;
        return dateString + " " + timeString;

    }
}
