<template>
    <a-space>

        <div style="display: flex;flex-direction: row;  padding: 0px">
            <div v-if="owners.length > sharedService.charLength">
                <a-tooltip placement="topLeft" :title="owners">
                    owners : {{ owners.substring(0, sharedService.charLength) + "..." }}
                </a-tooltip>
            </div>
            <div v-else>
                owners : {{ owners }}
            </div>
        </div>
    </a-space>

</template>
<script setup>

defineProps({
    owners: {
        type: String,
        required: true
    }

});

import { useSharedService } from "@/features/common/SharedService";

const sharedService = useSharedService();

</script>