import {ACCOUNT, AUTH, BASE_URL, TRANSACTION} from "../../config.js";

export const CUSTOMER_ACCOUNTS = `${BASE_URL}${ACCOUNT}/customers`;
export const VERIFY_BALANCE = `${BASE_URL}${ACCOUNT}/verify-balance`;

export const ME = `${BASE_URL}${AUTH}/me`;

export const TRANSACTION_HISTORY = `${BASE_URL}${TRANSACTION}`;
export const DEPOSIT = `${BASE_URL}${TRANSACTION}/deposit`;
export const WITHDRAW = `${BASE_URL}${TRANSACTION}/withdrawal`;
export const TRANSFER = `${BASE_URL}${TRANSACTION}/transfer`;
export const EMAIL_HISTORY = `${BASE_URL}${TRANSACTION}/email-history`;