import apiClient from "../apiClient.js";

const ENDPOINT = "api/countries";

const countryService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add: (nombre) => {
        return apiClient.post(ENDPOINT, { nombre });
    }
}

export default countryService;