import {apiRequest} from "../../../utils/api.js";
import {BASE_URL, AUTH} from "../../../config.js";

export async function logIn(email, password){
    return await apiRequest(`${BASE_URL}${AUTH}/login`,
        "POST",
        {email, password});
}

export async function logOut(){
    return await apiRequest(`${BASE_URL}${AUTH}/logout`, "POST");
}