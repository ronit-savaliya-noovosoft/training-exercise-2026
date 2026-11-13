import { apiRequest } from "../../../utils/api.js";
import {JOB_HISTORY} from "../constants.js";

export async function getJobHistory(page, limit){
    return await apiRequest(`${JOB_HISTORY}?page=${page}&limit=${limit}`, "GET");
}