import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/routes";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 15000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem("token");
          router.push("/auth/login");
          ElMessage.error("登录已过期，请重新登录");
          break;
        case 403:
          ElMessage.error("没有权限访问");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error(data?.message || "服务器错误");
          break;
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.message.includes("timeout")) {
      ElMessage.error("请求超时，请稍后重试");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  },
);

export default service;
