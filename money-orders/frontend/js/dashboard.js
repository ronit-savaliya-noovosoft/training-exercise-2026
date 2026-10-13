const API_URL = "http://localhost:5000/api";

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

const deposit = document.getElementById('deposit');
deposit.addEventListener('click', async function deposit(e){
   e.preventDefault();

   const amount = document.getElementById('deposit-amount').value;
   const accountId = document.getElementById('select-deposit-to').value;

   try{
       const response = await fetch(`${API_URL}/transactions/deposit`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ accountId, amount }),
       });

       const data = await response.json();

       console.log(data);
   } catch (error){
       console.log("Error:", error);
   }
});


window.addEventListener('DOMContentLoaded', fetchAndDisplayData);


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