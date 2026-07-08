import apiClient from "../apiClient.js";
const ENDPOINT = "api/countries";
const countryService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add: (name) => {
        return apiClient.post(ENDPOINT, { name });
    },
    update: (id, name) => {
        return apiClient.put(`${ENDPOINT}/${id}`, { name });
    }
}
export default countryService;