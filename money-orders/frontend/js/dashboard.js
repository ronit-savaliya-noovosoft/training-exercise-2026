const API_URL = "http://localhost:5000/api";

// Display User Information
const user_name = document.getElementById('user_name');
const user_email = document.getElementById('user_email');
const user_role = document.getElementById('user_role');
const avatar = document.getElementById('avatar');
const user_account = document.getElementById('user_account');
const account_balance = document.getElementById('account_balance');

// Get Me
async function fetchMe(e){
    e.preventDefault();

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    const hour = new Date().getHours();

    if (hour < 12) {
        user_name.innerText = "Good Morning! " + result.user.name;
    } else if (hour < 17) {
        user_name.innerText = "Good Afternoon! " + result.user.name;
    } else if (hour < 21) {
        user_name.innerText = "Good Evening! " + result.user.name;
    }

    console.log(result);

    user_email.innerText = result.user.email;
    user_role.innerText = result.user.role;
    user_account.innerText = result.user.account_number===undefined ? "Logged in as Manager" :result.user.account_number;
    account_balance.innerText = result.user.balance===undefined ? "0.00" :result.user.balance;

    let parts = result.user.name.split(" ");

    avatar.innerText = parts[0][0]+parts[1][0];
}

window.addEventListener('DOMContentLoaded', fetchMe);

// Dropdowns
const dropdowns = document.querySelectorAll('#select-deposit-to, #select-withdraw-from, #select-transfer-to, #select-transfer-from');
async function fetchAndDisplayData() {
    try {
        const response = await fetch(`${API_URL}/accounts/customers`);
        const result = await response.json();

        console.log(result);
        dropdowns.forEach((dropdown)=>{
            dropdown.innerHTML = result.accounts.map(item => `
                <option value="${item.account_id}">${item.name} (${item.account_number})</option>
            `).join('');
        });

    } catch (err) {
        console.log(err);
    }
}

// Transactions
const deposit = document.getElementById('deposit');
deposit.addEventListener('click', async function deposit(e){
   e.preventDefault();

   const amount = document.getElementById('deposit-amount').value;
   const accountId = document.getElementById('select-deposit-to').value;

   console.log(accountId);

   try{
       const response = await fetch(`${API_URL}/transactions/deposit`, {
           method: "POST",
           credentials: "include",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ accountId, amount }),
       });

       const data = await response.json();

       console.log(data);
   } catch (error){
       console.log("Error:", error);
   }

   amount.value = "";
   accountId.value = "";
});

const withdraw = document.getElementById('withdraw');
withdraw.addEventListener('click', async function withdraw(e){
    e.preventDefault();

    const amount = document.getElementById('withdraw-amount').value;
    const accountId = document.getElementById('select-withdraw-from').value;

    console.log(accountId);

    try{
        const response = await fetch(`${API_URL}/transactions/withdrawal`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId, amount }),
        });

        const data = await response.json();

        fetchTransactionHistory();

        console.log(data);
    } catch (error){
        console.log("Error:", error);
    }
});

const transfer = document.getElementById('transfer');
transfer.addEventListener('click', async function transfer(e){
    e.preventDefault();

    const amount = document.getElementById('transfer-amount').value;
    const fromAccountId = document.getElementById('select-transfer-from').value;
    const toAccountId = document.getElementById('select-transfer-to').value;

    console.log(fromAccountId);
    console.log(toAccountId);

    try{
        const response = await fetch(`${API_URL}/transactions/transfer`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromAccountId, toAccountId, amount }),
        });

        const data = await response.json();

        console.log(data);
    } catch (error){
        console.log("Error:", error);
    }
});

window.addEventListener('DOMContentLoaded', fetchAndDisplayData);

// Transaction History
const transactions = document.getElementById('transactions');
async function fetchTransactionHistory(){
    try {
        const response = await fetch(`${API_URL}/transactions`,{
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if(result.status === 'success'){
            if(result.transactions.length === 0){
                transactions.innerHTML = '<p>No entries found yet.</p>'
                return;
            }
        }

        transactions.innerHTML = result.transactions.map(item => `
            <tr>
                <td>${item.type}</td>
                <td>${item.sender || "-"}</td>
                <td>${item.receiver || "-"}</td>
                <td>${item.amount}</td>
                <td>${item.status}</td>
            </tr>
        `).join('');

        console.log(result);
    }
    catch (error){
        console.log(error);
    }
}

window.addEventListener('DOMContentLoaded', fetchTransactionHistory);

// Log Out
const logout = document.getElementById('logout');
logout.addEventListener('click', async function logout(e){
    e.preventDefault();

    try {
        await fetch(`${API_URL}/auth/logout`, { method: "POST" });
        localStorage.clear();
        alert("Logged out!");
        window.location.href = '../index.html';
    } catch (error) {
        console.error("Error:", error);
    }
});