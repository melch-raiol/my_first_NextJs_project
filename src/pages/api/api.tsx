import axios from 'axios';

export default axios.create({
    baseURL: 'https://tarefasplus-7437f-default-rtdb.firebaseio.com/',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});