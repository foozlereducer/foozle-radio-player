import axios from 'axios';

console.log('backend url in axiosBackend.js', import.meta.env.VITE_BACKEND_URL)
// Create an axios instance for the client-side
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});