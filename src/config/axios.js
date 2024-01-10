import axios from 'axios';

const baseUrl = import.meta.env.VITE_SERVER;
console.log(baseUrl);
const instance = axios.create({
  baseUrl,
})

export default instance;