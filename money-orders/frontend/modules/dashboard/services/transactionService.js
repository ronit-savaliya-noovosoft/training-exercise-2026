import { apiRequest } from "../../../utils/api.js";
import {DEPOSIT, EMAIL_HISTORY, TRANSACTION_HISTORY, TRANSFER, WITHDRAW} from "../constants.js";

export async function getTransactionHistory(page, limit){
    return await apiRequest(`${TRANSACTION_HISTORY}?page=${page}&limit=${limit}`, "GET");
}

export async function depositInAccount(accountId, amount){
    return await apiRequest(`${DEPOSIT}`,
        "POST",
        {accountId, amount});
}

export async function withdrawFromAccount(accountId, amount){
    return await apiRequest(`${WITHDRAW}`,
        "POST",
        {accountId, amount});
}

export async function transferFromAccount(fromAccountId, toAccountId, amount){
    return await apiRequest(`${TRANSFER}`,
        "POST",
        {fromAccountId, toAccountId, amount});
}

export async function emailTransaction(records, type, fromDate, toDate){
    return await apiRequest(`${EMAIL_HISTORY}`,
        "POST",
        {
            limit: Number(records),
            type: type,
            fromDate: fromDate,
            toDate: toDate});
}