import apiClient from "../apiClient.js";
const ENDPOINT = "api/states";
const statesService = {
    get: () => {
        return apiClient.get(ENDPOINT);
    },
    add: (name, country_id) => {
        return apiClient.post(ENDPOINT, { name, country_id });
    },
    getByCountry: (country_id) => {
        return apiClient.get(ENDPOINT, {country_id});
    },
    update : (id, name, country_id) => {
        return apiClient.put(`${ENDPOINT}/${id}`, { name, country_id });
    }
}
export default statesService;