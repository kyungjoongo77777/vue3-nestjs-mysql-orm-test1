// @flow// @flow
<template>
    <PortalHeader title="FileMainPage"/>
    <div style="margin: 1px 30px 30px 30px; min-height: auto">
        <div v-if="fileService.loading"
             style="display: flex; justify-content: center; margin-top: 20px;height: 110px;">
            <a-spin></a-spin>
        </div>
        <!-- todo: my folder 인 경우 -->
        <div class="wrap" v-else-if=" fileService.tabIndex===0 "
        >
            <div v-if="fileService.myFileResults.length===0"
                 style="justify-content: center;display: flex;align-items: center; width: 900px;">
                No Data In My Folder
            </div>
            <div v-for="(item, index) in fileService.myFileResults" :key="index.toString()">
                <FileFolderOne
                    :filename="item.fileName"
                    :filetype="item.fileType"
                    :fileSize="item.fileSize"
                    :id="item.id"
                    :owner="item.owner"
                    :isTrash="item.isTrash"
                    :folderName="item.folderName"
                    :createdDt="item.createdDt"
                    :sharedUsers="item.sharedUsers"
                />
            </div>
        </div>
        <!-- todo: common folder 인 경우 -->
        <div class="wrap" v-else-if=" fileService.tabIndex===1 "
        >
            <div v-if="fileService.sharedResults.length===0"
                 style="justify-content: center;display: flex;align-items: center; width: 920px;">
                No Shared Data
            </div>
            <div v-for="(item, index) in fileService.sharedResults">
                <FileFolderOne
                    :index="index"
                    :trashResults="fileService.trashResults"
                    :filename="item.fileName"
                    :filetype="item.fileType"
                    :fileSize="item.fileSize"
                    :id="item.id"
                    :owner="item.owner"
                    :isTrash="item.isTrash"
                    :folderName="item.folderName"
                    :createdDt="item.createdDt"
                    :sharedUsers="item.sharedUsers"
                />
            </div>
        </div>
        <!-- todo: trash tab 인 경우 -->
        <!-- todo: trash tab 인 경우 -->
        <!-- todo: trash tab 인 경우 -->
        <div class="wrap" v-else-if=" fileService.tabIndex===2 "
        >
            <div v-if="fileService.trashResults.length===0"
                 style="justify-content: center;display: flex;align-items: center; width: 900px;">
                No Data In Trash Can
            </div>
            <div v-for="(item, index) in fileService.trashResults">
                <FileFolderOne
                    :index="index"
                    :trashResults="fileService.trashResults"
                    :filename="item.fileName"
                    :filetype="item.fileType"
                    :fileSize="item.fileSize"
                    :id="item.id"
                    :owner="item.owner"
                    :isTrash="item.isTrash"
                    :folderName="item.folderName"
                    :createdDt="item.createdDt"
                    :sharedUsers="item.sharedUsers"
                />
            </div>
        </div>
        <!-- todo: ##########-->
        <!-- todo: ShareModal-->
        <!-- todo: ##########-->
        <ShareModal/>
        <FolderCreationModal/>
    </div>
</template>
<style>
.wrap {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    -webkit-flex-flow: wrap;
    flex-flow: wrap;
}

</style>

<script setup>

import {useRouter} from "vue-router";
import {useFileService} from "@/features/file/FileService";
import PortalHeader from "@/components/FileMainPageHeader.vue";
import FileFolderOne from "@/components/FileFolderOne.vue";
import {onMounted} from "vue";
import ShareModal from "@/components/ShareModal.vue";
import FolderCreationModal from "@/components/FolderCreationModal.vue";

const router = useRouter();
const fileService = useFileService();

onMounted(async () => {

    await fileService.value.getFileList();
});

</script>

