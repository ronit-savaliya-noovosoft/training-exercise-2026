import {apiRequest} from "../../../utils/api.js";
import {BASE_URL, AUTH} from "../../../config.js";

export async function signUp(name, email, password){
    return await apiRequest(`${BASE_URL}${AUTH}/signup`,
        "POST",
        { name, email, password });
}