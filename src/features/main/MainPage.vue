<template>
    <CommonHeader title="메인페이지" type="main" />
    <div style="height: 150px" />
    <div style="justify-content: center;display: flex; align-items: center; align-self: center; align-content: center">
        <a-image
            :width="700"
            :height="500"
            src="https://db.kookje.co.kr/news2000/photo/2022/0713/L20220713.22001003399i1.jpg"
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
