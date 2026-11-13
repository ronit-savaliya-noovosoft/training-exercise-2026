import {apiRequest} from "../../../utils/api.js";
import {ALL_ACCOUNTS, CREATE_ACCOUNT, MY_ACCOUNTS, SELECT_ACCOUNT, DEACTIVATE_ACCOUNT} from "../constants.js";


export async function getAllAccounts(page, limit, search){
    const params = new URLSearchParams({
        page: page,
        limit: limit,
        search: search
    });

    return await apiRequest(`${ALL_ACCOUNTS}?${params.toString()}`, "GET");
}

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

export async function deactivateAccount(accountId){
    return await apiRequest(`${DEACTIVATE_ACCOUNT}`, "POST",
        { accountId });
}