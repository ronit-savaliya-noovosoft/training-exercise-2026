import {apiRequest} from "../../../utils/api.js";
import {BASE_URL, ACCOUNT} from "../../../config.js";

export async function getAccounts(){
    return await apiRequest(`${BASE_URL}${ACCOUNT}/customers`, "GET");
}