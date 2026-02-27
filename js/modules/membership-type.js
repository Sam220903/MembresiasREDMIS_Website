import membershipsService from "../api/services/memberships.js";

const memberships = membershipsService.get();

console.log(memberships);
