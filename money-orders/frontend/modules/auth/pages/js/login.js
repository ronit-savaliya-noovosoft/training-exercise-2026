import {logIn} from "../../services/loginService.js";

const login = document.getElementById('login');
const message = document.getElementById('login-message');

login.addEventListener('click', async function login(e) {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email === "" || password === ""){
        message.innerText = "Email and password are required.";
        return;
    }

    if(!regex.test(email)){
        message.innerText = "Invalid Email Address.";
        return;
    }

    try {
        const data = await logIn(email, password);

        if (data.status === "success") {
            window.location.href = data.user.role ==="admin"
                ? '../../../dashboard/pages/html/admin_dashboard.html'
                : '../../../dashboard/pages/html/dashboard.html';
            alert("Login successful!");
        }
        else {
            message.innerText = data.message;
            alert(data.message || "Login failed");
        }
    } catch (error) {
        message.innerText = error.message;
        console.error("Error:", error);
    }
});