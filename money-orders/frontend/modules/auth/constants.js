import {AUTH, BASE_URL} from "../../config.js";

export const LOGIN = `${BASE_URL}${AUTH}/login`;
export const LOGOUT = `${BASE_URL}${AUTH}/logout`;
export const SIGNUP = `${BASE_URL}${AUTH}/signup`;

export const FORGOT_PASSWORD = `${BASE_URL}${AUTH}/forgot-password`;
export const RESET_PASSWORD = `${BASE_URL}${AUTH}/reset-password`;