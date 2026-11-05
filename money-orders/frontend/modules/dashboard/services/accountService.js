import {apiRequest} from "../../../utils/api.js";
import {CUSTOMER_ACCOUNTS, GET_BALANCE, VERIFY_BALANCE} from "../constants.js";

export async function getAccounts(){
    return await apiRequest(`${CUSTOMER_ACCOUNTS}`, "GET");
}

export async function getAccountBalance(password){
    return await apiRequest(`${VERIFY_BALANCE}`, "POST",
        {password});
}

export async function getBalanceOfSelectedCustomer(accountId){
    return await apiRequest(`${GET_BALANCE}`, "POST",
        {id: accountId});
}