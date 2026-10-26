import {signUp} from "../../services/registerService.js";

const register = document.getElementById('register');
const message = document.getElementById('signup-message');

register.addEventListener('click', async function signup(e) {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email === "" || password === "" || name === ""){
        message.innerText = "Name, email and password are required.";
        return;
    }

    if(!regex.test(email)){
        message.innerText = "Invalid Email Address.";
        return;
    }

    try {
        const data = await signUp(name, email, password);

        if (data.status === "success") {
            alert("Sign Up successful!");
            message.innerText = data.message;
            window.location.href = '../../../auth/pages/html/login.html'
        } else {
            message.innerText = data.message;
            alert(data.message || "Sign Up failed");
        }
    } catch (error) {
        message.innerText = error.message;
        console.error("Error:", error);
    }
});

