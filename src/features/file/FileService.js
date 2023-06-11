import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import axios from "axios";
import { toJS } from "mobx";
import { useUserService } from "@/features/user/UserService";
import { useSharedService } from "@/features/common/SharedService";
import { END_POINT_PREFIX } from "@/constants/constants";
import _ from "lodash";
import { useToast } from "vue-toast-notification";
import { axiosInstance } from "@/utils/utils";

export const useFileService = createGlobalObservable(() => {
    return useLocalObservable(() => ({
        count: 0,
        myFileResults: [],
        sharedResults: [],
        trashResults: [],
        checkboxList: [],
        isChecked: false,
        deleteItemCount: 0,
        totalFileSize: 0,
        readableTotalFileSize: 0,
        folderList: [],
        currentUserId: undefined,
        currentFolderName: "/",
        currentFileId: undefined,
        showModal: false,
        showShareModal: false,
        showFolderModal: false,
        loading: false,
        tabIndex: 0,
        /**
         * @todo: fetch all file(or folder) list
         * @returns {Promise<void>}
         */
        async getFileList() {
            const sharedService = useSharedService();
            let results = await axiosInstance.get(END_POINT_PREFIX + "/file");
            if (results.data.statusCode === 200) {
                let fileList = results.data.data;
                let _myFileList = [];
                let _shareFileList = [];
                let _trashFileList = [];
                let _totalFileSize = 0;
                for (let fileOne of fileList) {
                    let ownerList = fileOne.owners.split(",");
                    for (let ownerOne of ownerList) {
                        if (ownerOne === this.currentUserId) {
                            if (!_.isEmpty(fileOne.fileSize)) {
                                let _fileSizeOne = parseInt(fileOne.fileSize);
                                _totalFileSize = _totalFileSize + parseInt(fileOne.fileSize);
                            }
                            if (ownerList.length === 1) {
                                if (!fileOne.isTrash) {
                                    _myFileList.push(fileOne);
                                } else {
                                    _trashFileList.push(fileOne);
                                }
                            } else {
                                _shareFileList.push(fileOne);
                            }
                        }
                    }
                }
                this.myFileResults = _myFileList;
                this.sharedResults = _shareFileList;
                this.trashResults = _trashFileList;
                let tempCheckList = [];
                for (let itemOne of _trashFileList) {
                    tempCheckList.push(false);
                }
                this.checkboxList = tempCheckList;
                this.totalFileSize = _totalFileSize;
                this.readableTotalFileSize = sharedService.value.bytesToSize(_totalFileSize);
                this.deleteItemCount = 0;
            } else {
                alert("file getFileList failed");
            }
        },
        /**
         * @todo: update file status
         * @param data
         * @returns {Promise<void>}
         */
        async updateFileOne(data) {
            this.loading = true;
            let results = await axiosInstance.put(END_POINT_PREFIX + "/file/" + this.currentFileId,
                data
            );
            if (results.data.statusCode === 200) {
                await this.getFileList();
            } else {
                alert("updateFileOne failed");
            }
            setTimeout(() => {
                this.loading = false;
            }, 1);
        },
        async deleteFileOne(pFileId) {
            try {
                this.loading = true;
                let results = await axiosInstance.delete(END_POINT_PREFIX + "/file/" + pFileId);

                if (results.data.statusCode === 200) {
                    await this.getFileList();
                } else {
                    alert("deleteFileOne failed");
                }
                setTimeout(() => {
                    this.loading = false;
                }, 1);
            } catch (e) {
                this.loading = false;
                throw new Error(e);
            }
        },
        /**
         * todo ; upload multiple files
         * @param formData
         * @returns {Promise<void>}
         */
        async insertFiles(formData) {
            const sharedService = useSharedService();
            try {
                let result = await axiosInstance({
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Access-Control-Allow-Origin": "*"
                    },
                    url: END_POINT_PREFIX + "/file",
                    method: "POST",
                    data: formData
                });
                if (result.status === 201) {
                    await this.getFileList();
                    sharedService.value.showToast("파일업로드 성공!", 1200);
                    this.showModal = false;
                    this.tabIndex = 0;
                } else {
                    sharedService.value.showToast("파일업로드 failed!", 2000);
                }
            } catch (e) {
                sharedService.value.showToast("파일업로드 failed!", 2000);
            }
        },
        /**
         * @todo: 파일을 다른 member에개 share
         * @returns {Promise<boolean>}
         */
        async shareFileOne() {
            const userService = useUserService();
            const sharedService = useSharedService();

            let resultOne = await axiosInstance.get(`${END_POINT_PREFIX}/file/${this.currentFileId}`);
            let ownerList = resultOne.data.data.owners.split(",");

            ownerList.push(userService.value.userToBeShared);
            //todo: 중복 체크
            if (!this.checkIfArrayIsUnique(ownerList)) {
                sharedService.value.showToast("이미 공유된 user입니다!");
                return false;
            } else {
                //todo: 중복이 안된 경우에만 db update
                //console.log("add ownerList===>", ownerList.toString());
                let data = {
                    "owners": ownerList.toString()
                };

                let results = await axiosInstance.put(`${END_POINT_PREFIX}/file/${this.currentFileId}`, data);
                if (results.data.statusCode === 200) {
                    await this.getFileList();
                    this.showShareModal = false;
                    sharedService.value.showToast("해당 파일 공유 성공!");
                } else {
                    alert(" shareFileOne failed");
                }
            }
        },
        /**
         * @todo: 폴더를 생성..
         * @param folderName
         * @returns {Promise<void>}
         */
        async insertFolderOne(folderName) {
            const sharedService = useSharedService();
            let data = {
                fileName: "",
                createdDt: "",
                fileSize: "",
                owners: localStorage.getItem("userId"),
                fileType: "folder",
                folderName: folderName,
                fileLocation: "",
                isFolder: true,
                isTrash: false
            };
            let results = await axiosInstance.post(END_POINT_PREFIX + "/file/folder",
                data
            );
            if (results.data.statusCode === 200) {
                await this.getFileList();
                sharedService.value.showToast("폴더 생성 성공!!");
                this.showFolderModal = false;
            } else {
                alert("file insertFolderOne failed");
            }

        },
        /**
         * @todo : arrList에 element가 있는지 중복 체크
         * @param myArray
         * @returns {boolean}
         */
        checkIfArrayIsUnique(myArray) {
            return myArray.length === new Set(myArray).size;
        },
        showToast(msg, duration = 1500) {
            const toast = useToast();
            toast.warning(msg, {
                duration: duration,
                position: "top"

            });
        },
        /**
         * todo: 삭제 confirm and delete 로직
         * @returns {Promise<void>}
         */
        async handleDeleteConfirm() {
            if (this.tabIndex === 1) {
                alert("공유된 파일은 삭제 불가능합니다");
            } else if (this.tabIndex === 0) {
                //todo: 휴지통에 이동하는 로직
                await this.updateFileOne({
                    isTrash: true
                });
            } else {
                //todo: 완전 삭제 로직
                try {
                    await this.deleteFileOne(this.currentFileId);
                } catch (e) {
                    alert(e.toString() + "[파일 삭제 실패]");
                }
            }
        }
    }));
});