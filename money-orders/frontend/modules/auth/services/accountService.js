import {apiRequest} from "../../../utils/api.js";
import {CREATE_ACCOUNT, MY_ACCOUNTS, SELECT_ACCOUNT} from "../constants.js";

export async function getMyAccounts(){
    return await apiRequest(`${MY_ACCOUNTS}`, "GET");
}

export async function selectAccount(accountId){
    return await apiRequest(`${SELECT_ACCOUNT}`, "POST",
        { accountId });
}

export async function createAccount(){
    return await apiRequest(`${CREATE_ACCOUNT}`, "POST");
}