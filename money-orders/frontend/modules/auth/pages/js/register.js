import { BASE_URL, AUTH } from "../../../../config.js";
import {signUp} from "../../services/registerService.js";

const register = document.getElementById('register');

register.addEventListener('click', async function signup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // const response = await fetch(`${BASE_URL}${AUTH}/signup`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name, email, password })
        // });

        const data = await signUp(name, email, password);

        if (data.status === "success") {
            alert("Sign Up successful!");
            localStorage.setItem("data", JSON.stringify(data));
            window.location.href = '../../../auth/pages/html/login.html'
        } else {
            alert(data.message || "Sign Up failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

