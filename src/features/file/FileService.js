// @flow
import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import { useUserService } from "@/features/user/UserService";
import { useSharedService } from "@/features/common/SharedService";
import { END_POINT_PREFIX } from "@/constants/constants";
import { useToast } from "vue-toast-notification";
import { axiosInstance } from "@/utils/utils";

export const useFileService = createGlobalObservable(() => {
    return useLocalObservable(() => ({
        count: 0,
        myFileResults: [],
        sharedResults: [],
        trashResults: [],
        isChecked: false,
        deleteItemCount: 0,
        totalFileSize: 0,
        readableTotalFileSize: 0,
        folderList: [],
        my_mergedList: [],
        currentUserId: "",
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
        async getIndex () {
            const sharedService = useSharedService();
            const userService = useUserService();
            let results = await axiosInstance.get(`${END_POINT_PREFIX}/`)

        },
        async getFileList () {
            const sharedService = useSharedService();
            const userService = useUserService();

            let results = await axiosInstance.get(`${END_POINT_PREFIX}/file/` + localStorage.getItem("userId"));
            if (results.data.statusCode === 200) {
                let allFileList = results.data.data;
                let _totalFileSize = 0;
                this.myFileResults = allFileList.myFileList;
                this.sharedResults = allFileList.shareFileList;
                this.trashResults = allFileList.trashFileList;
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
        async updateFileOne (data) {
            this.loading = true;
            let results = await axiosInstance.put(END_POINT_PREFIX + "/file/" + this.currentFileId,
                data
            );
            if (results.data.statusCode === 200) {
                await this.getFileList();
            } else {
                alert("updateFileOne failed");
            }
            this.loading = false;
        },
        async deleteFileOne (pFileId) {
            try {
                let results = await axiosInstance.delete(END_POINT_PREFIX + "/file/" + pFileId);
                if (results.data.statusCode === 200) {
                    await this.getFileList();
                } else {
                    alert("deleteFileOne failed");
                }
            } catch (e) {
                throw new Error(e);
            }
        },
        /**
         * todo ; upload multiple files
         * @param formData
         * @returns {Promise<void>}
         */
        async insertFiles (formData) {
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
        async shareFileOne () {

            const userService = useUserService();
            const sharedService = useSharedService();

            let resultOne = await axiosInstance.get(`${END_POINT_PREFIX}/file/getFileOne/${this.currentFileId}`);
            let _newSharedUsers = [];

            //todo shared_user is empty인경우.....
            if (resultOne.data?.data?.sharedUsers === null) {
                resultOne.data.data.sharedUsers = undefined;
                _newSharedUsers.push(this.currentUserId);
            }

            //todo shared_user가 있는 경우..
            if (resultOne.data?.data?.sharedUsers !== undefined) {
                _newSharedUsers = resultOne.data.data.sharedUsers.split(",");
            }
            _newSharedUsers.push(userService.value.usersToBeShared);
            //todo: 중복 체크
            if (!this.checkIfArrayIsUnique(_newSharedUsers)) {
                sharedService.value.showToast("이미 공유된 user입니다!");
                return false;
            } else {
                //todo: 중복이 안된 경우에만 db update
                let data = {
                    "sharedUsers": _newSharedUsers.toString()
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
        async insertFolderOne (folderName) {
            const sharedService = useSharedService();
            let data = {
                fileName: "",
                createdDt: "",
                fileSize: "",
                owner: localStorage.getItem("userId"),
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
        checkIfArrayIsUnique (myArray) {
            return myArray.length === new Set(myArray).size;
        },
        showToast (msg, duration = 1500) {
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
        async handleDeleteConfirm () {
            if (this.tabIndex === 0 || this.tabIndex === 1) {
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
