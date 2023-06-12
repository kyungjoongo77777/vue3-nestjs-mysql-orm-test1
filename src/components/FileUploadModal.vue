<template>
    <!--    todo: ##############-->
    <!--    todo: upload modal  -->
    <!--    todo: ##############-->
    <a-modal
        :destroy-on-close="true"
        ok-text="upload"
        v-model:visible="fileService.showModal" title="업로드할 파일을 선택 하세요" @ok="handleSubmitFile">
        <div>

            <div style="height: 3px" />
            <div style="display: flex;flex-direction: row">
                <div style="display: flex; align-self: center; justify-content: center; align-items: center">
                    파일 선택
                </div>
                <div style="margin-left: 10px">
                    <a-input
                        multiple="true"
                        defaultValue=""
                        id="file_input" type="file" @change="handleOnchangeFile" placeholder="" />
                </div>
            </div>
            <div style="margin-top: 10px;">
                <div style="color: red; margin-top: 0px; margin-left: 62px;">* 다중 파일 업로드 가능 [최대 20개]</div>
            </div>
            <br />
        </div>
    </a-modal>
</template>

<script setup>


import { ref } from "vue";
import { useToast } from "vue-toast-notification";

import { useFileService } from "@/features/file/FileService";
import { useSharedService } from "@/features/common/SharedService";

const fileService = useFileService();

const files = ref("");
const folder = ref(null);
const toast = useToast();
const handleOnchangeFile = async (event) => {
    files.value = event.target.files;
};


const handleSubmitFile = async (e) => {
    const sharedService = useSharedService();
    if (parseInt(fileService.value.totalFileSize) > (20 * 1000 * 1000)) {
        sharedService.value.showToast("전체 파일 용량이 20MB 이상은 업로드 불가능합니다.", 2000);
    } else {
        let formData = new FormData(); // formData 객체를 생성한다.
        for (let fileOne of files.value) {
            formData.append("file", fileOne);
        }
        formData.append("owner", fileService.value.currentUserId);
        formData.append("folderName", fileService.value.currentFolderName);
        formData.append("isFolder", false);
        await fileService.value.insertFiles(formData);
    }
};

</script>