import {getAccountBalance, getAccounts} from "../../services/accountService.js";

let accounts;

// Dropdowns
const dropdowns = document.querySelectorAll('#select-deposit-to, #select-withdraw-from, #select-transfer-to, #select-transfer-from');
export async function fetchAndDisplayAccounts(user_data) {
    const messages = document.getElementsByClassName('dropdown-message');

    try {
        const result = await getAccounts();
        accounts = result.accounts;

        if(user_data.role === 'customer'){
            for(let i=0; i<=2; i++){
                dropdowns[i].setAttribute('disabled', 'disabled');
                dropdowns[i].innerHTML =`
                    <option value="${user_data.account_id}" selected>${user_data.name} (${user_data.account_number})</option>
                `;
            }
        }
        else if(user_data.role==='manager') {
            for(let i=0; i<=2; i++){
                dropdowns[i].innerHTML = accounts.map(item => `
                    <option value="${item.account_id}">${item.name} (${item.account_number})</option>
                `).join('');
            }
        }

        // Array.from(messages).forEach(div => {
        //     div.innerHTML += `<span> ${result.message}</span>`;
        // });
    } catch (e) {
        console.log(e);
        Array.from(messages).forEach(div => {
            div.innerHTML += `<span> ${e.message}</span>`;
        });
    }
}

export async function updateTransferToDropdown(){
    dropdowns[3].innerHTML = accounts
        .filter(item => String(item.account_id) !== String(dropdowns[2].value))
        .map(item => `
                  <option value="${item.account_id}">${item.name} (${item.account_number})</option>
            `).join('');
}

dropdowns[2].addEventListener('change', updateTransferToDropdown);

// Verify Account Balance
const accountBalance = document.getElementById('accountBalance');
const toggleBalance = document.getElementById('toggleBalance');

let balanceVisible = false;
let currentBalance = null;
toggleBalance.addEventListener('click', async () => {
    const message = document.getElementById("verify-balance-message");
    message.textContent = "";

    if(balanceVisible){
        accountBalance.textContent = "******";
        balanceVisible = false;
        return;
    }

    const password = prompt("Enter Password:");

    if(!password){
        console.log("Please enter password");
        return;
    }

    try{
        const result = await getAccountBalance(password);
        currentBalance = result.balance;
        accountBalance.textContent = currentBalance;
        balanceVisible = true;
    }
    catch (e){
        message.textContent = e.message;
        message.classList.add("text-danger");
        console.log(e.message);
    }
});
