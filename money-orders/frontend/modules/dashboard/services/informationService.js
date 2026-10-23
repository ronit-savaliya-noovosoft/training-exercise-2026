import { apiRequest } from "../../../utils/api.js";
import {ME} from "../constants.js";

export async function getMyself(){
    return await apiRequest(`${ME}`, "GET");
}