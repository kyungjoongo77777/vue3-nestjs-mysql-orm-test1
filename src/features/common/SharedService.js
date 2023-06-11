import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import { useToast } from "vue-toast-notification";

export const useSharedService = createGlobalObservable(() => {
    return useLocalObservable(() => ({
        results: [],
        loading: false,
        charLength: 33,
        showToast(msg, duration = 1500) {
            const toast = useToast();
            toast.warning(msg, {
                duration: duration,
                position: "top"
            });
        },
        bytesToSize(bytes) {
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if (bytes === 0) return "n/a";
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
            if (i === 0) return `${bytes} ${sizes[i]})`;
            return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
        }
    }));
});