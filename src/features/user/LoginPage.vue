<template>
    <Header title="로그인 " :can-go-back="true" />
    <div style="margin: 30px">
        <br />
        <div style="margin:10px;">
            <a-dropdown-button>
                사람 아이콘을 클릭 또는 위치하여 유저 선택
                <template #overlay>
                    <a-menu @click="handleMenuClick">
                        <div v-for="(item, index) in userService.results">
                            <a-menu-item :key="item.userId">
                                <UserOutlined />
                                {{ item.userId }}
                            </a-menu-item>
                        </div>

                    </a-menu>
                </template>
                <template #icon>
                    <UserOutlined />
                </template>
            </a-dropdown-button>
        </div>
        <div style="height: 30px"></div>
        <div style="margin: 10px">
            <div>
                * User ID
                <div style="height: 3px" />
                <a-input v-model:value="userId" placeholder="" />
            </div>
            <br />
            <div>
                * Password
                <div style="height: 3px" />
                <a-input placeholder="" v-model:value="userPwd" :type="showPwd">
                    <template #suffix>
                        <a-tooltip title="show/hide passsword">
                            <EyeOutlined style="color: rgba(0, 0, 0, 0.45)" @click="toggleShowPwd" />
                        </a-tooltip>
                    </template>
                </a-input>
            </div>
            <br />
            <a-button @click="handleLogin" type="primary" style="width: 100%">
                submit
            </a-button>
        </div>
    </div>


</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import Header from "@/components/CommonHeader.vue";
import { useFileService } from "@/features/file/FileService";
import { useUserService } from "@/features/user/UserService";
import { UserOutlined, EyeOutlined } from "@ant-design/icons-vue";
import _ from "lodash";
import { useSharedService } from "@/features/common/SharedService";

const router = useRouter();
const fileService = useFileService();
const userId = ref("");
const userPwd = ref("");
const showPwd = ref("password");
const userService = useUserService();
onMounted(() => {
    userService.value.getUsers();
});

const handleMenuClick = (e) => {
    //console.log("click", e);
    userId.value = e.key;
};

const toggleShowPwd = () => {
    if (showPwd.value === "") {
        showPwd.value = "password";
    } else {
        showPwd.value = "";
    }
};

async function handleLogin() {
    const sharedService = useSharedService();

    if (_.isEmpty(userId.value)) {
        sharedService.value.showToast("userid를 입력하세요!");
        return false;
    }

    try {
        const data = {
            userId: userId.value,
            userPwd: userPwd.value
        };

        let results = await userService.value.loginWithIdPwd(data);

        if (results.data.ok) {
            localStorage.setItem("userId", userId.value);
            localStorage.setItem("accessToken", results.data.accessToken);
            fileService.value.myFileResults = [];
            fileService.value.tabIndex = 0;
            await router.replace("/FileMainPage");
        } else {
            throw new Error("id,pwd 가 맞지 않습니다.:[" + results.data.result + "]");
        }

    } catch (e) {
        sharedService.value.showToast(e.toString());
    }


}

</script>
