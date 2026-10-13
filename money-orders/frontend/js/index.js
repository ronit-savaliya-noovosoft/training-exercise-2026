const API_URL = "http://localhost:5000/api";
console.log(API_URL);

const submit = document.getElementById('submit');
submit.addEventListener('click', async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(email);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("data", JSON.stringify(data));
            window.location.href = './pages/dashboard.html'
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
