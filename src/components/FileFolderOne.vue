<template>
    <a-card hoverable class="fileOneOuter">
        <div style="display: flex;flex-direction: row">
            <div style="flex: .9">
                <div v-if="filetype==='pdf'"
                     style="height: 25px;">
                    <PdfIcon style="width: 35px;height: 35px;" />
                </div>
                <div v-else-if="filetype==='doc' || filetype==='odt' || filetype==='docx'">
                    <WordIcon style="width: 35px;height: 35px;" />
                </div>
                <div v-else-if="filetype==='png'">
                    <a-image
                        :width="40"
                        :height="40"
                        :src="`${END_POINT_PREFIX}/${filename}`"
                    />
                </div>
                <!--        todo: ##########################-->
                <!--        todo: 파일타입이 폴더일 경우 보여주는 부분-->
                <!--        todo: ##########################-->
                <div v-else-if="filetype==='folder'">
                    <div class="" style="justify-content: center;display: flex; flex-direction: column">
                        <div style="display: flex;flex-direction: row">
                            <div
                                style="margin-top: -10px; display: flex;justify-content: center; font-size: 14pt; color:maroon;flex:.9">
                                {{ folderName }}
                            </div>
                        </div>
                        <div style="height: 10px" />

                        <FolderOutlined style="font-size: 150px" />
                        <Owners :owners="owners" />
                    </div>
                </div>
            </div>
            <!--            todo: trash 모드 체크 박스 표시 부분 -->
            <div style="flex: .1; margin-right: -12px">
                <div v-if="fileService.tabIndex===2">
                    <a-checkbox @change="handleClickCheckbox(index)"
                                v-model:checked="fileService.checkboxList[index]"></a-checkbox>
                </div>
            </div>
        </div>

        <div v-if="filetype==='folder'">
            <div>
            </div>
        </div>
        <div v-else>
            <div style="height: 15px;" />
            <div style="font-size: 11px;font-weight: 700">
                {{ filename }}
            </div>
            <div style="font-size: 11px;font-weight: 700">
                id: {{ id }}
            </div>
            <div style="height: 5px;"></div>
            <div>
                date : {{ createdDt }}
            </div>
            <div>
                size : {{ bytesToSize(fileSize) }}
            </div>
            <Owners :owners="owners" />
        </div>
        <div
            style="position: absolute;bottom: 18px;margin-left: 19px;
            display: flex;flex-direction: row;justify-content: flex-end;align-self: flex-end;align-items: flex-end;
            ">
            <!--                todo: ###############-->
            <!--                 todo: trashIcon-->
            <!--                todo: ###############-->
            <a href="#" style="flex: .33">

                <!--                todo: ###############-->
                <!--                todo: 완전 삭제 아이콘-->
                <!--                todo: ###############-->
                <div v-if="fileService.tabIndex===2" @click="setFileId(id)">
                    <a-popconfirm
                        title="완전히 삭제하기를 원하십니까?(완전 삭제는 복구가 불가능합니다)"
                        ok-text="네"
                        cancel-text="아니오"
                        @confirm="()=>fileService.handleDeleteConfirm()"
                        @cancel="cancel"
                    >
                        <DeleteOutlined style="font-size: 25px;color: red" />
                    </a-popconfirm>
                </div>
                <!--                todo: ###############-->
                <!--                todo: 일반 삭제 아이콘-->
                <!--                todo: ###############-->
                <div v-else-if="fileService.tabIndex===1" @click="setFileId(id)">
                    <DeleteOutlined style="font-size: 25px" />
                </div>
                <div v-else @click="setFileId(id)">
                    <a-popconfirm
                        title="진짜로 삭제 하실래요????"
                        ok-text="네"
                        cancel-text="아니오"
                        @confirm="()=>fileService.handleDeleteConfirm()"
                        @cancel="cancel"
                    >
                        <DeleteOutlined style="font-size: 25px" />
                    </a-popconfirm>
                </div>
            </a>
            <div style="width: 60px;"/>
            <!--                todo: ###############-->
            <!--                 todo: shareButton-->
            <!--                todo: ###############-->
            <a href="#" style="flex: .33" @click="handleClickShare(id)">
                <ShareAltOutlined style="font-size: 25px" />
            </a>
            <div style="width: 60px;"/>
            <!--                todo: ###############-->
            <!--                todo: download button-->
            <!--                todo: ###############-->
            <a :href="`${END_POINT_PREFIX}/${filename}`" target="_blank" style="flex: .33">
                <DownloadOutlined style="font-size: 25px" />
            </a>
        </div>
    </a-card>
</template>
<style>

.fileOneOuter {
    background-color: #eceff1;
    width: 285px;
    height: 305px;
    border-radius: 10px;
    flex: .33;
    margin: 0.7rem;
    flex-wrap: wrap;
}

</style>


<script setup>
import PdfIcon from "@/components/icons/PdfIcon.vue";
import WordIcon from "@/components/icons/WordIcon.vue";
import { useFileService } from "@/features/file/FileService";
import { DeleteOutlined, DownloadOutlined, FolderOutlined, ShareAltOutlined } from "@ant-design/icons-vue";
import { useSharedService } from "@/features/common/SharedService";
import { END_POINT_PREFIX } from "@/constants/constants";
import Owners from "@/components/Owners.vue";


defineProps({
    filename: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    owners: {
        type: String,
        required: true
    }
    ,
    isTrash: {
        type: Boolean,
        required: true
    },
    folderName: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: false
    },
    trashResults: {
        type: Array,
        required: false
    },
    createdDt: {
        type: Array,
        required: true
    }
});
const sharedService = useSharedService();

const setFileId = (id) => {
    if (fileService.value.tabIndex === 1) {
        sharedService.value.showToast("공유된 파일은 삭제할수 없어요!");
    } else {
        fileService.value.currentFileId = id;
    }
};

const handleClickShare = (id) => {
    fileService.value.currentFileId = id;
    fileService.value.showShareModal = true;
};

const handleClickDownload = () => {
    alert("handleClickDownload");
};

function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}

const fileService = useFileService();


const cancel = (e) => {
    //console.log(e);
};

//const checkboxList = ref([]);

const handleClickCheckbox = (index) => {

    if (fileService.value.trashResults[index].checked === undefined) {
        fileService.value.trashResults[index].checked = true;
    } else if (fileService.value.trashResults[index].checked === false) {
        fileService.value.trashResults[index].checked = true;
    } else {
        fileService.value.trashResults[index].checked = false;
    }

    let _trashResults = fileService.value.trashResults;

    let tempCount = 0;
    for (let itemOne of _trashResults) {
        if (itemOne.checked === true) {
            tempCount++;
        }
    }

    fileService.value.deleteItemCount = tempCount;
};

</script>