import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

let isRefreshing = false;

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // 🟢 consistent naming
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/refreshAccessToken`, {
                    refreshToken,
                });

                const { token, newRefreshToken } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Retry the original request
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                originalRequest.headers["Authorization"] = `Bearer ${token}`;

                isRefreshing = false;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

     
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                //Prevent further retry attempts
                isRefreshing = false;

                // notify user or trigger global logout logic here

                // Don’t retry, just reject
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
