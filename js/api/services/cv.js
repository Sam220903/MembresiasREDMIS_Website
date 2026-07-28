import apiClient from '../apiClient.js';

const ENDPOINT = 'api/cv';

const cvService = {
    // Historial de CVs del miembro autenticado y el más reciente: { cvs: [...], latest: {...} }
    get: () => {
        return apiClient.get(ENDPOINT);
    },

    getByID: (id) => {
        return apiClient.get(`${ENDPOINT}/${id}`);
    },

    upload: (cvBase64) => {
        return apiClient.post(ENDPOINT, { cv_base64: cvBase64 });
    },

    update: (id, cvBase64) => {
        return apiClient.patch(`${ENDPOINT}/${id}`, { cv_base64: cvBase64 });
    }
};

export default cvService;
