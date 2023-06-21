<template>
    <CommonHeader title="메인페이지" type="main" />
    <div style="height: 150px" />
    <div style="justify-content: center;display: flex; align-items: center; align-self: center; align-content: center">
        <a-image
            :width="700"
            :height="500"
            src="https://as2.ftcdn.net/v2/jpg/01/05/90/77/1000_F_105907729_4RzHYsHJ2UFt5koUI19fc6VzyFPEjeXe.jpg"
        />
    </div>
    <Footer />
</template>
<script setup>
import { useRouter } from "vue-router";
import CommonHeader from "@/components/CommonHeader.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter();

</script>
