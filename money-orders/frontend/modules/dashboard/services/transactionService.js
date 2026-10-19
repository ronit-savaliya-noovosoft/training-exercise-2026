import { apiRequest } from "../../../utils/api.js";
import { BASE_URL, TRANSACTION } from "../../../config.js";

export async function getTransactionHistory(page, limit){
    return apiRequest(`${BASE_URL}${TRANSACTION}?page=${page}&limit=${limit}`, "GET");
}

export async function depositInAccount(accountId, amount){
    return apiRequest(`${BASE_URL}${TRANSACTION}/deposit`,
        "POST",
        {accountId, amount});
}

export async function withdrawFromAccount(accountId, amount){
    return apiRequest(`${BASE_URL}${TRANSACTION}/withdrawal`,
        "POST",
        {accountId, amount});
}

export async function transferFromAccount(fromAccountId, toAccountId, amount){
    return apiRequest(`${BASE_URL}${TRANSACTION}/transfer`,
        "POST",
        {fromAccountId, toAccountId, amount});
}

export async function emailTransaction(records, type, fromDate, toDate){
    return apiRequest(`${BASE_URL}${TRANSACTION}/email-history`,
        "POST",
        {
            limit: Number(records),
            type: type,
            fromDate: fromDate,
            toDate: toDate});
}