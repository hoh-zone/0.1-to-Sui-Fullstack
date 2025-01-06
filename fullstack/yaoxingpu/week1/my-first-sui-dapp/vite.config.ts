/*
 * @Author: yaoxingpu yaoxpu@163.com
 * @Date: 2025-01-03 23:26:49
 * @LastEditors: yaoxingpu yaoxpu@163.com
 * @LastEditTime: 2025-01-04 00:11:00
 * @FilePath: /my-first-sui-dapp/vite.config.ts
 * @Description:
 *
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //   配置路径别名
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
