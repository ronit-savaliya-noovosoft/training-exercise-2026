import {apiRequest} from "../../../utils/api.js";
import {FORGOT_PASSWORD, RESET_PASSWORD} from "../constants.js";

export async function forgotPassword(email){
    return await apiRequest(`${FORGOT_PASSWORD}`,
        "POST",
        {email});
}

export async function resetPassword(token, newPassword){
    return await apiRequest(`${RESET_PASSWORD}`,
        "POST",
        {token, newPassword});
}