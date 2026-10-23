import {logIn} from "../../services/loginService.js";

const login = document.getElementById('login');
const message = document.getElementById('login-message');

login.addEventListener('click', async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await logIn(email, password);

        if (data.status === "success") {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '../../../dashboard/pages/html/dashboard.html';
            alert("Login successful!");
        } else {
            message.innerText = data.message;
            alert(data.message || "Login failed");
        }
    } catch (error) {
        message.innerText = error.message;
        console.error("Error:", error);
    }
});