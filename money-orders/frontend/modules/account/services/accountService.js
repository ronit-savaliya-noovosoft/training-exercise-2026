import {apiRequest} from "../../../utils/api.js";
import {
    ALL_ACCOUNTS,
    CREATE_ACCOUNT,
    MY_ACCOUNTS,
    SELECT_ACCOUNT,
    DEACTIVATE_ACCOUNT,
    REQUEST_FOR_CREATE_ACCOUNT,
    GET_PENDING_REQUESTS, CANCEL_ACCOUNT_REQUEST
} from "../constants.js";


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

export async function createAccountCreationRequest(){
    return await apiRequest(`${REQUEST_FOR_CREATE_ACCOUNT}`, "POST");
}

export async function createAccount(userId, requestId){
    return await apiRequest(`${CREATE_ACCOUNT}`, "POST",
        { userId, requestId });
}

export async function deactivateAccount(accountId){
    return await apiRequest(`${DEACTIVATE_ACCOUNT}`, "POST",
        { accountId });
}

export async function getPendingAccountRequests(){
    return await apiRequest(`${GET_PENDING_REQUESTS}`, "GET");
}

export async function cancelAccountRequest(requestId){
    return await apiRequest(`${CANCEL_ACCOUNT_REQUEST}`, "POST",
        { requestId });
}