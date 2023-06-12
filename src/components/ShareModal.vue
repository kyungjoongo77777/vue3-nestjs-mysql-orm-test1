<template>
    <!--    todo: ##############-->
    <!--    todo: upload modal  -->
    <!--    todo: ##############-->
    <a-modal
        ok-text="share"
        v-model:visible="fileService.showShareModal" title="해당 자료를 공유 할사람을 선택하시오!"

        @ok="handleShare"
    >
        <div style="margin:10px;">
            <a-dropdown-button>
                <div style="width: 100px">
                    해당 파일을 공유할 사람을 선택
                </div>
                <template #overlay style="width: 120px">
                    <a-menu @click="handleMenuClick">
                        <div v-for="(item, index) in userService.results">
                            <a-menu-item :key="item.userId">
                                <UserOutlined />
                                {{ item.userId }}
                            </a-menu-item>
                        </div>

                    </a-menu>
                </template>
                <div style="height: 15px;" />
                <div style="display: flex;flex-direction: row; margin-left: -16px;">
                    <a-input v-model:value="userService.usersToBeShared" placeholder="" style="width: 250px;color: navy"
                             disabled
                    />
                </div>
                <template #icon>
                    <UserOutlined />
                </template>
            </a-dropdown-button>
        </div>
    </a-modal>
</template>

<script setup>


import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";

import { useFileService } from "@/features/file/FileService";
import { UserOutlined } from "@ant-design/icons-vue";
import { useUserService } from "@/features/user/UserService";

const fileService = useFileService();
const userService = useUserService();
const file = ref(null);
const toast = useToast();
const handleOnchangeFile = async (event) => {
    file.value = event.target.files[0];

};

onMounted(() => {
    userService.value.getSharedUsers();
});

const handleMenuClick = (e) => {
    userService.value.usersToBeShared = e.key;

};

const handleShare = async (e) => {
    await fileService.value.shareFileOne();
};

</script>