const API_URL = "http://localhost:5000/api";
console.log(API_URL);

const submit = document.getElementById('submit');
const account_list = document.getElementById('accounts-list');

submit.addEventListener('click', async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(email);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        console.log(data.user);

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("data", JSON.stringify(data));
            // account_list.classList.remove('hidden');
            window.location.href = './pages/dashboard.html'
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function() {
    account_list.classList.add('hidden');
});

