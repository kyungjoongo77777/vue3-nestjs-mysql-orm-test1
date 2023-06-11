<template>
    <!--    todo: ##############-->
    <!--    todo: upload modal  -->
    <!--    todo: ##############-->
    <a-modal
        ok-text="folder 생성"
        v-model:visible="fileService.showFolderModal" title="생성할 폴더이름을 입력" @ok="handleSubmit">
        <div>
            <div style="height: 3px" />
            <a-input v-model:value="folderName" ref="folderRef" placeholder="" v-on:keyup.enter="handleSubmit" />
        </div>
    </a-modal>
</template>

<script setup>


import { ref, watch } from "vue";

import { useFileService } from "@/features/file/FileService";
import _ from "lodash";

const fileService = useFileService();
const folderName = ref("");
const folderRef = ref(null);


watch(() => fileService.value.showFolderModal, (val) => {
    if (val) {
        setTimeout(() => {
            folderRef.value.focus();
        }, 100);
    }
});


async function handleSubmit() {
    if (_.isEmpty(folderName.value)) {
        fileService.value.showToast("폴더 Name을 입력하시오!");
        return false;
    }

    await fileService.value.insertFolderOne(folderName.value);
    fileService.value.tabIndex = 0;
    folderName.value = undefined;

}

</script>

