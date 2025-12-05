import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const api = axios.create({
    baseURL: API_URL,
});

export const register = async (username: string, mazeConfig: any) => {
    const response = await api.post('/register', { username, mazeConfig });
    return response.data;
};

export const getMaze = async (username: string) => {
    const response = await api.get(`/maze/${username}`);
    return response.data;
};

export const login = async (username: string, path: any[]) => {
    const response = await api.post('/login', { username, path });
    return response.data;
};
