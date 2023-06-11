<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    canGoBack: {
        type: Boolean
    }
});

import { useRouter } from "vue-router";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";

const router = useRouter();


</script>

<template>
    <div v-if="type === 'main'">
        <div style="width: 1000px;padding: 0px;">
            <div
                style="border: 2px solid rgb(235, 237, 240); width: 100%; background-color: navy; color: white;
            display: flex;height: 50px; align-self: center;align-items: center;
            flex-direction: row"
            >
                <div style="flex: .3; margin-left: 20px;">
                    메인 페이지
                </div>
                <div style="flex: .7; justify-content: flex-end;display: flex; margin-right: 1em;">
                    <a-button type="link" @click="()=> router.push('SignupPage')">
                        <div style="color: orange">
                            회원가입
                        </div>
                    </a-button>
                    <div style="width: 1em" />
                    <a-button type="link" @click="()=> router.push('LoginPage')">
                        <div style="color: orange">
                            로그인
                        </div>
                    </a-button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="header">
            <div
                style="border: 2px solid rgb(235, 237, 240); width: 100%; background-color: navy; color: white;
            display: flex;height: 50px; align-self: center;align-items: center;
            flex-direction: row"
            >
                <div style="flex: .3; margin-left: 20px;" @click="()=>router.back()">
                    <ArrowLeftOutlined />
                </div>
                <div style="flex: .3; margin-left: 20px;">
                    {{ title }}
                </div>
            </div>
        </div>
    </div>


</template>