import {ACCOUNT, AUTH, BASE_URL} from "../../config.js";

export const LOGIN = `${BASE_URL}${AUTH}/login`;
export const LOGOUT = `${BASE_URL}${AUTH}/logout`;
export const SIGNUP = `${BASE_URL}${AUTH}/signup`;

export const MY_ACCOUNTS = `${BASE_URL}${ACCOUNT}/my-accounts`;
export const SELECT_ACCOUNT = `${BASE_URL}${ACCOUNT}/select`;
export const CREATE_ACCOUNT = `${BASE_URL}${ACCOUNT}/create-account`