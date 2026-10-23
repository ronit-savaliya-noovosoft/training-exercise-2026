import {getMyself} from "../../services/informationService.js";
import {logOut} from "../../../auth/services/loginService.js";

// Display User Information
export let user_data = null;
const user_name = document.getElementById('user_name');
const user_email = document.getElementById('user_email');
const user_role = document.getElementById('user_role');
const avatar = document.getElementById('avatar');
const user_account = document.getElementById('user_account');
// const account_balance = document.getElementById('account_balance');

// Get Me
export async function fetchMe(e){
    e.preventDefault();

    const result = await getMyself();

    const hour = new Date().getHours();

    if (hour < 12) {
        user_name.innerText = "Good Morning! " + result.user.name;
    } else if (hour < 17) {
        user_name.innerText = "Good Afternoon! " + result.user.name;
    } else if (hour < 21) {
        user_name.innerText = "Good Evening! " + result.user.name;
    }

    user_email.innerText = result.user.email;
    user_role.innerText = result.user.role;
    user_account.innerText = result.user.account_number===undefined ? "Logged in as Manager" :result.user.account_number;

    let parts = result.user.name.split(" ");

    avatar.innerText = parts.length>=2? parts[0][0]+parts[1][0] : parts[0][0];

    user_data = result.user;
}


// Log Out
const logout = document.getElementById('logout');
logout.addEventListener('click', async function logout(e){
    e.preventDefault();

    try {
        await logOut();
        localStorage.clear();
        alert("Logged out!");
        window.location.href = '../../../auth/pages/html/login.html';
    } catch (e) {
        console.error("Error:", e);
    }
});