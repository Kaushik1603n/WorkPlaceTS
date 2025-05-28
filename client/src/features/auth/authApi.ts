// import axiosClient from '../../utils/axiosClient';

// export const authApi = {
//   register: (userData:string) => axiosClient.post('/auth/register', userData),
//   login: (credentials:string) => axiosClient.post('/auth/login', credentials),
//   verifyEmail: (token:string) => axiosClient.post('/auth/verify-otp', token),
//   forgotPassword: (email:string) => axiosClient.post('/auth/forgot-password', email ),
//   resetOtp: (otp:string) => axiosClient.post('/auth/verify-reset-otp',  otp ),
//   reSentOtp: (userId:string) => axiosClient.post('/auth/resend-otp', userId  ),
//   resetPassword: (data:string) => axiosClient.post('/auth/reset-password', data),
//   logout: () => axiosClient.post('/auth/logout'),
//   getMe: () => axiosClient.get('/auth/me'),
// };