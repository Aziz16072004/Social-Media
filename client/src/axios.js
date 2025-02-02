import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://social-media-2-o8uj.onrender.com'
  : 'http://localhost:10000';

axios.defaults.baseURL = baseURL;

export default axios;