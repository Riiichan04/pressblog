import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueuedRequest {
    resolve: (value: string) => void;
    reject: (reason?: unknown) => void;
}

const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || ""}${process.env.NEXT_PUBLIC_API_VERSION || ""}`,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err: unknown) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const currentRefreshToken = Cookies.get("refreshToken");

                // Gửi RT cũ lên Body
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || ""}${process.env.NEXT_PUBLIC_API_VERSION || ""}/auth/refresh`,
                    { refreshToken: currentRefreshToken }
                );

                const newAccessToken = refreshResponse.data.data.jwtToken;
                const newRefreshToken = refreshResponse.data.data.refreshToken;

                Cookies.set("token", newAccessToken);
                Cookies.set("refreshToken", newRefreshToken);

                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return apiClient(originalRequest);

            } catch (refreshError: unknown) {
                processQueue(refreshError, null);

                Cookies.remove("token");
                Cookies.remove("refreshToken");
                Cookies.remove("user_session");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;