import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import axios from "axios";
import { END_POINT_PREFIX } from "@/constants/constants";
import { useRouter } from "vue-router";
import { useSharedService } from "@/features/common/SharedService";
import { useToast } from "vue-toast-notification";
import { axiosInstance } from "@/utils/utils";
import { useFileService } from "@/features/file/FileService";

export const useUserService = createGlobalObservable(() => {
    return useLocalObservable(() => ({
        count: 0,
        results: [],
        usersToBeShared: undefined,
        /**
         * todo:  fetch  all user
         * @returns {Promise<void>}
         */
        async getUsers() {
            this.loading = true;
            let results = await axiosInstance.get(`${END_POINT_PREFIX}/user`);
            if (results.data.statusCode === 200) {
                this.results = results.data.data;
            } else {
                alert("xhr fetch 실패");
            }
            setTimeout(() => {
                this.loading = false;
            }, 250);
        },
        async getSharedUsers() {
            this.loading = true;
            const fileService = useFileService();
            let results = await axiosInstance.get(`${END_POINT_PREFIX}/user`);
            if (results.data.statusCode === 200) {
                let _sharedUsers = [];
                for (let item of results.data.data) {
                    if (item.userId !== fileService.value.currentUserId) {
                        _sharedUsers.push(item);
                    }
                }
                this.results = _sharedUsers;
            } else {
                alert("xhr fetch 실패");
            }
            setTimeout(() => {
                this.loading = false;
            }, 250);
        },
        /**
         * todo:  SignUp member
         * @param userInfo
         * @returns {Promise<boolean>}
         * @constructor
         */
        async SignUp(userInfo) {
            try {
                const sharedService = useSharedService();
                const router = useRouter();
                this.loading = true;
                let results = await axiosInstance.post(END_POINT_PREFIX + "/user/createUserWithEncryptPassword", userInfo);
                //console.log("results===>", results);
                if (results.data.statusCode === 200) {
                    sharedService.value.showToast("가입 완료, 로그인 해주세요!!");
                    return true;
                } else {
                    sharedService.value.showToast("가입 failed");
                    return false;
                }
            } catch (e) {
                alert(e.toString() + " [회원가입 애러- 아이디는 중복 될수 없습니다 확인 부탁!]");
            }
        },
        async loginWithIdPwd(data) {
            let results = await axiosInstance.post(END_POINT_PREFIX + "/auth/login", data);
            return results;
        },

        async getUserInfoWithToken(data) {
            let results = await axiosInstance.post(END_POINT_PREFIX + "/auth/getUserInfoWithToken", data);
            return results;
        },
        showToast(msg) {
            const toast = useToast();
            toast.warning(msg, {
                duration: 1500,
                position: "top"
            });
        }
    }));
});