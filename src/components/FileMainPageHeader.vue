<template>
    <div class="header">
        <div

            style=" width: 100%; background-color: navy; color: white;
            display: flex;height: 50px; align-self: center;align-items: center;
            flex-direction: row; padding: 0px"
        >
            <div style="flex: .3; margin-left: 10px;flex-direction: row;display: flex">
                <div>
                    <a-avatar style="background-color: #f56a00">{{ fileService.currentUserId?.substring(0, 2) }}
                    </a-avatar>
                </div>
                <div
                    style="flex: .4;margin-left: 15px;  align-self: center; justify-content: center; align-items: center">
                    {{ fileService.currentUserId }}
                </div>
                <div style="flex: .1"></div>
                <div style="flex: .7;font-size: 11px; align-self: center; justify-content: center; align-items: center"
                >
                    사용용량: {{ (fileService.readableTotalFileSize) === "n/a" ? 0 : fileService.readableTotalFileSize }} /
                    20MB
                </div>
            </div>
            <div style="flex: .7; flex-direction: row; display: flex; justify-content: flex-end">
                <div @click="handleTabClick(0)"
                     style="flex: .15; margin-left: 20px;align-self: center; cursor: pointer"
                >
                    <div v-if="fileService.tabIndex===0"
                         style="color: orange">
                        내폴더
                    </div>
                    <div v-else style="color: white">
                        내폴더
                    </div>
                </div>
                <div @click="handleTabClick(1)"
                     style="flex: .15; margin-left: 20px;align-self: center; cursor: pointer"
                >
                    <div v-if="fileService.tabIndex===1"
                         style="color: orange">
                        공유폴더
                    </div>
                    <div v-else style="color: white">
                        공유폴더
                    </div>
                </div>
                <div @click="handleTabClick(2)"
                     style="flex: .15; margin-left: 20px;align-self: center; cursor: pointer"
                >
                    <div v-if="fileService.tabIndex===2"
                         style="color: orange">
                        휴지통
                    </div>
                    <div v-else style="color: white">
                        휴지통
                    </div>
                </div>
                <div @click="handleLogout"
                     style="flex: .15; margin-left: 20px;align-self: center; cursor: pointer"
                >
                    로그아웃
                </div>
                <div style="flex: .14; margin-left: 20px;align-self: center; margin-right: 8px;">
                    <a-button @click="showFolderCreationModal()">
                        폴더 생성
                    </a-button>
                </div>
                <div style="flex: .14; margin-right: 20px;margin-left: 10px;">
                    <a-button @click="showModal">
                        파일 업로드
                    </a-button>
                </div>
            </div>
        </div>
        <div
            class="deleteDiv"
        >
            <div v-if="fileService.tabIndex===2">
                <a-popconfirm
                    title="전체 아이템을 삭제할래요?"
                    ok-text="네"
                    cancel-text="아니오"
                    @confirm="handleClickMultipleDelete(true)"
                >
                    <a-button>
                        전체 삭제
                    </a-button>
                </a-popconfirm>
            </div>
            <div style="width: 10px"></div>
            <div v-if="fileService.deleteItemCount>0">
                <a-popconfirm
                    title="진짜로 선택된 item을 삭제 하실래요?"
                    ok-text="네"
                    cancel-text="아니오"
                    @confirm="handleClickMultipleDelete(false)"
                >
                    <a-button>
                        선택된 아이템 삭제
                    </a-button>
                </a-popconfirm>
            </div>
        </div>
    </div>

    <UploadModal />
</template>
<style>
.deleteDiv {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: transparent;
    justify-content: flex-end;
    padding-right: 20px;
    padding-top: 10px;
    height: 50px;
    align-self: center;
    align-items: center
}
</style>
<script setup>

import UploadModal from "@/components/FileUploadModal.vue";
import { useFileService } from "@/features/file/FileService";
import { useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { useSharedService } from "@/features/common/SharedService";

defineProps({
    title: {
        type: String,
        required: true
    }
});

const router = useRouter();
const fileService = useFileService();

onBeforeMount(() => {
    fileService.value.getFileList();
    fileService.value.currentUserId = localStorage.getItem("userId");
});

const handleClickMultipleDelete = (isAll = false) => {
    try {
        let _trashResults = fileService.value.trashResults;
        for (let itemOne of _trashResults) {
            //todo: 전체삭제의 경우..
            if (isAll) {
                fileService.value.deleteFileOne(itemOne.id);
            } else {//체크된 아이템에 대해서 만 삭제
                if (itemOne.checked === true) {
                    fileService.value.deleteFileOne(itemOne.id);
                }
            }
        }
        fileService.value.getFileList();
        fileService.value.showToast("파일 삭제 완료!");
        fileService.value.isChecked = false;
    } catch (e) {
        alert("파일 삭제 실패" + e.toString());
        alert(e.toString());
    }
};

const handleLogout = () => {
    localStorage.clear();
    const sharedService = useSharedService();
    sharedService.value.showToast("로그 아웃 되었습니다");
    router.replace("/");
};

function handleTabClick(tabIndex) {
    fileService.value.tabIndex = tabIndex;
    //todo: tab변경시 checked_item 초기화
    fileService.value.deleteItemCount = 0;
    let _trashResults = [];
    for (let itemOne of fileService.value.trashResults) {
        itemOne.checked = false;
        _trashResults.push(itemOne);
    }
    fileService.value.trashResults = _trashResults;
}


const showModal = () => {
    fileService.value.showModal = true;
};

const showFolderCreationModal = () => {
    fileService.value.showFolderModal = true;
};


</script>

