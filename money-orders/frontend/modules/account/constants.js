import {BASE_URL, ACCOUNT} from "../../config.js";

export const ALL_ACCOUNTS = `${BASE_URL}${ACCOUNT}/all-accounts`;
export const MY_ACCOUNTS = `${BASE_URL}${ACCOUNT}/my-accounts`;
export const SELECT_ACCOUNT = `${BASE_URL}${ACCOUNT}/select`;
export const CREATE_ACCOUNT = `${BASE_URL}${ACCOUNT}/create-account`;
export const DEACTIVATE_ACCOUNT = `${BASE_URL}${ACCOUNT}/deactivate-account`;
export const REQUEST_FOR_CREATE_ACCOUNT = `${BASE_URL}${ACCOUNT}/account-creation-request`;
export const GET_PENDING_REQUESTS = `${BASE_URL}${ACCOUNT}/get-pending-account-requests`;
export const CANCEL_ACCOUNT_REQUEST = `${BASE_URL}${ACCOUNT}/cancel-request`;