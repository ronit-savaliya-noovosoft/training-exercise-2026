import { apiRequest } from "../../../utils/api.js";
import { BASE_URL, AUTH } from "../../../config.js";

export async function getMyself(){
    return await apiRequest(`${BASE_URL}${AUTH}/me`, "GET");
}