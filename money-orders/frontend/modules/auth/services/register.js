import { BASE_URL, AUTH } from "../../../config.js";

const register = document.getElementById('register');

register.addEventListener('click', async function signup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}${AUTH}/signup`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Sign Up successful!");
            localStorage.setItem("data", JSON.stringify(data));
            // account_list.classList.remove('hidden');
            window.location.href = '../../dashboard/pages/dashboard.html'
        } else {
            alert(data.message || "Sign Up failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

