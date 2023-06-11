import { createRouter, createWebHistory } from "vue-router";
import _ from "lodash";
import { useSharedService } from "@/features/common/SharedService";
import jwt_decode from "jwt-decode";

const sharedService = useSharedService();

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../features/main/MainPage.vue")
        },
        {
            path: "/SignupPage",
            name: "SignupPage",
            component: () => import("../features/user/SignupPage.vue")
        },
        {
            path: "/LogInPage",
            name: "LogInPage",
            component: () => import("../features/user/LoginPage.vue")
        },
        {
            path: "/FileMainPage",
            name: "FileMainPage",
            component: () => import("../features/file/FileMainPage.vue")
        },
        // {
        //     path: "/temp",
        //     name: "temp",
        //     component: () => import("../features/temp/temp.vue")
        // }
    ]
});


router.beforeEach(async (to, from) => {
    if (to.name === "FileMainPage" && !await isAuthenticated()) {
        sharedService.value.showToast("인증이 정보가 존재 하지 않아요!, 로그인 해주세요!", 1000);
        return { name: "LogInPage" };
    } else {
        return true;
    }

});

async function isAuthenticated() {
    let accessToken = localStorage.getItem("accessToken");
    if (_.isEmpty(accessToken)) {
        return false;
    } else {
        try {
            let decodeResult = jwt_decode(accessToken);
            // console.log("decodeResult===>", decodeResult);
            // console.log("!!!!!!!!!!! valid token !!!!!!!!!!!!!!!");
            return true;
        } catch (e) {//todo: 저장된 토큰이 유효한 토큰이 아닌 경우...
            console.log("invalid token...===>", e.toString());
            return false;
        }
    }

}

export default router;




// async function test(){
//     let data = {
//         accessToken: accessToken
//     };
//     let result = await userService.value.getUserInfoWithToken(data);
//     let fetchedUserId = result.data.userId;
//     let loginUserId = localStorage.getItem("userId");
//     if (loginUserId === fetchedUserId) {
//         console.log("userId, fetchedUserid same !!!!!!!!!!===>");
//         return true;
//     } else {
//         return false;
//     }
// }