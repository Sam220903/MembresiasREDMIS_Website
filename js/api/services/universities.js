import apiClient from '../apiClient.js';
const ENDPOINT = 'api/universities';
const universitiesService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add : (name, country_id) => {
        return apiClient.post(ENDPOINT, { name, country_id });
    },
    update : (id, name, country_id) => {
        return apiClient.put(`${ENDPOINT}/${id}`, { name, country_id });
    }
}
export default universitiesService;