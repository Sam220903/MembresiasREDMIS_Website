import apiClient from "../apiClient.js";

const ENDPOINT = "api/paises";

const countryService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add: (nombre) => {
        return apiClient.post(ENDPOINT, { nombre });
    }
}

export default countryService;