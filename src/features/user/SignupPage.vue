<template>
    <Header title=" 회원가입" />
    <div style="margin: 30px">
        <h1>
            회원가입
        </h1>
        <br />
        <div>
            * User ID
            <div style="height: 3px" />
            <a-input v-model:value="userId" placeholder="" />
        </div>
        <br />
        <div>
            * Password
            <div style="height: 3px" />
            <a-input type="password" v-model:value="userPwd" placeholder="" />
        </div>
        <br />
        <div>
            * Password Confirm
            <div style="height: 3px" />
            <a-input type="password" v-model:value="userPwd2" placeholder="" />
        </div>
        <br />
        <div>
            Full Name
            <div style="height: 3px" />
            <a-input v-model:value="fullName" placeholder="" />
        </div>
        <br />
        <div>
            Company Name
            <div style="height: 3px" />
            <a-input v-model:value="companyName" placeholder="" />
        </div>
        <br />
        <a-button @click="handleClickSubmit" type="primary" style="width: 100%">
            Submit
        </a-button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Header from "@/components/CommonHeader.vue";
import _ from "lodash";
import { useUserService } from "@/features/user/UserService";

const router = useRouter();
const useService = useUserService();
const userId = ref("");
const userPwd = ref("");
const userPwd2 = ref("");
const fullName = ref("");
const companyName = ref("");

async function handleClickSubmit() {
    let userInfo = {
        userId: userId.value,
        userPwd: userPwd.value,
        fullName: fullName.value,
        companyName: companyName.value
    };

    if (_.isEmpty(userId.value)) {
        useService.value.showToast("userId를 입력하시오!");
        return false;
    } else if (_.isEmpty(userPwd.value)) {
        useService.value.showToast("userPwd 입력하시오!");
        return false;
    } else if (_.isEmpty(userPwd2.value.trim())) {
        useService.value.showToast("userConfirm pwd를 입력하시오!");
        return false;
    } else if (userPwd.value !== userPwd2.value) {
        useService.value.showToast("password와  confirm password가 다릅니다 확인하세요!");
        return false;
    }

    let result = await useService.value.SignUp(userInfo);
    if (result) {
        setTimeout(async () => {
            await router.push("/LogInPage");
        }, 250);
    }
}

</script>

