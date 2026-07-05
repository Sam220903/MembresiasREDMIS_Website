import apiClient from '../apiClient.js';

const ENDPOINT = 'api/universities';

const universitiesService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },

    add : (nombre, pais_id) => {
        return apiClient.post(ENDPOINT, { nombre, pais_id });
    }   
   
}

export default universitiesService;