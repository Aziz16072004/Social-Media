import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:10000'
  : 'http://localhost:8000';

axios.defaults.baseURL = baseURL;

export default axios;