import apiClient from "../apiClient.js";

const ENDPOINT = "api/estados";

const statesService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add: (nombre, pais_id) => {
        return apiClient.post(ENDPOINT, { nombre, pais_id });
    }
}

export default statesService;