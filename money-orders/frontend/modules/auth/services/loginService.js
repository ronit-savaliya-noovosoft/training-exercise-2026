import {apiRequest} from "../../../utils/api.js";
import {LOGIN, LOGOUT} from "../constants.js";

export async function logIn(email, password){
    return await apiRequest(`${LOGIN}`,
        "POST",
        {email, password});
}

export async function logOut(){
    return await apiRequest(`${LOGOUT}`, "POST");
}