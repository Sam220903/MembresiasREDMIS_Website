import apiClient from '../apiClient.js';

const ENDPOINT = 'api/investigationLines';

const investigationLinesService = {
    get: () =>{
        return apiClient.get(ENDPOINT);
    },

    add: (line) => {
        return apiClient.post(ENDPOINT, line);
    },

    delete: (id) => {
        return apiClient.delete(`${ENDPOINT}/${id}`);
    }
};

export default investigationLinesService;