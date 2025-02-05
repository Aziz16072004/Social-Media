import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://social-media-xd1j.onrender.com/api'
  : 'http://localhost:8000/api';

axios.defaults.baseURL = baseURL;

export default axios;