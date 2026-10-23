import {apiRequest} from "../../../utils/api.js";
import {SIGNUP} from "../constants.js";

export async function signUp(name, email, password){
    return await apiRequest(`${SIGNUP}`,
        "POST",
        { name, email, password });
}