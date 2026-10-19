import {logIn} from "../../services/loginService.js";

const login = document.getElementById('login');

login.addEventListener('click', async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // const response = await fetch(`${BASE_URL}${AUTH}/login`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email, password })
        // });

        const data = await logIn(email, password);

        console.log(data);

        if (data.status === "success") {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '../../../dashboard/pages/html/dashboard.html';
            alert("Login successful!");
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});