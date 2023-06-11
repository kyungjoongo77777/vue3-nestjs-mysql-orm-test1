import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        port: 3000,
        host: true,
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        "primary-color": "#1DA57A",
                        "link-color": "#1DA57A",
                        "border-radius-base": "2px"
                    },
                    javascriptEnabled: true
                }
            }
        }
    }
});
