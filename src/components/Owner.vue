<template>
    <a-space>

        <div style="display: flex;flex-direction: row;  padding: 0px">

            소유자 : {{ owner }}
        </div>
    </a-space>

</template>
<script setup>

defineProps({
    owner: {
        type: String,
        required: true
    }

});

import { useSharedService } from "@/features/common/SharedService";

const sharedService = useSharedService();

</script>