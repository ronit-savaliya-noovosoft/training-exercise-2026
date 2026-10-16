import { BASE_URL, AUTH } from "../../../config.js";

const login = document.getElementById('login');

login.addEventListener('click', async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}${AUTH}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '../../dashboard/pages/dashboard.html'
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});