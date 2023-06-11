import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import { useToast } from "vue-toast-notification";

export const useMainService = createGlobalObservable(() => {
    return useLocalObservable(() => ({
        temp: 0,
        showToast(msg, duration =1500) {
            const toast = useToast();
            toast.warning(msg, {
                duration: duration,
                position: "top"

            });
        },

    }));
});