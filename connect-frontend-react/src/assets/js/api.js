import axios from "axios";

// Store tokens (example: memory or localStorage)
// let accessToken = localStorage.getItem("accessToken");
// let refreshToken = localStorage.getItem("refreshToken");
const deviceId = "my-device-123"; // your device ID

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Device-Id": deviceId,
  },
});

// Request interceptor: attach access token
// api.interceptors.request.use((config) => {
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// // Response interceptor: auto-refresh token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if 401 error and not retrying already
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       refreshToken
//     ) {
//       originalRequest._retry = true;

//       try {
//         // Call refresh token endpoint
//         const response = await axios.post(
//           "http://localhost:8080/auth/refresh",
//           null,
//           {
//             params: { refreshToken },
//             headers: { "Device-Id": deviceId },
//           }
//         );

//         // Update access token
//         accessToken = response.data.accessToken;
//         localStorage.setItem("accessToken", accessToken);

//         // Retry original request with new token
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed", err);
//         // Optional: logout user
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
