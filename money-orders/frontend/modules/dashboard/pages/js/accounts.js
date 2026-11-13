import {getAccountBalance, getAccounts, getBalanceOfSelectedCustomer} from "../../services/accountService.js";

let accounts;

// Dropdowns
const dropdowns = document.querySelectorAll('#select-deposit-to, #select-withdraw-from, #select-transfer-to, #select-transfer-from');
const messages = document.querySelectorAll('#select-deposit-to-message, #select-withdraw-from-message, #select-transfer-to-message, #select-transfer-from-message');
const common_message = document.getElementsByClassName('common-message');

let currentAccountId = null;
export async function fetchAndDisplayAccounts(user_data) {
    try {
        const result = await getAccounts();
        accounts = result.accounts;
        currentAccountId = user_data.account_id;

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

                const result = await getBalanceOfSelectedCustomer(dropdowns[i].value);
                messages[i].textContent =  result.balance;
            }
        }
    } catch (e) {
        console.log(e);
        Array.from(messages).forEach(div => {
            div.innerHTML += `<span> ${e.message}</span>`;
        });
    }
}

export async function showAndVerifyBalance(messageDiv, accountId){
    if(messageDiv.textContent!==""){
        const result = await getBalanceOfSelectedCustomer(accountId);
        messageDiv.textContent =  result.balance;
    }
}

export async function updateTransferToDropdown(user_data){
    dropdowns[3].innerHTML = accounts
        .filter(item => String(item.account_id) !== String(dropdowns[2].value))
        .map(item => `
                  <option value="${item.account_id}">${item.name} (${item.account_number})</option>
            `).join('');

    if(user_data.role==="manager"){
        const result = await getBalanceOfSelectedCustomer(dropdowns[3].value);
        messages[3].textContent = result.balance;
    }
}

export async function showFilterMessage(user_data) {
    const header_option = document.getElementById("account-section");
    const handle_accounts = document.getElementById("handle-accounts");
    if(user_data.role === "customer"){
        handle_accounts.style.display = "none";

        for(let i=0; i<=3; i++){
            common_message[i].replaceChildren();
        }
    }else if(user_data.role === "manager"){
        header_option.style.display = "none";
    }else{
        handle_accounts.style.display = "none";
        header_option.style.display = "none";
    }
}

dropdowns[2].addEventListener('change', updateTransferToDropdown);
dropdowns[0].addEventListener('change', async () => {
   await showAndVerifyBalance(messages[0], dropdowns[0].value);
});

dropdowns[1].addEventListener('change', async () => {
    await showAndVerifyBalance(messages[1], dropdowns[1].value);
});

dropdowns[2].addEventListener('change', async () => {
    await showAndVerifyBalance(messages[2], dropdowns[2].value);
});

dropdowns[3].addEventListener('change', async () => {
    await showAndVerifyBalance(messages[3], dropdowns[3].value);
});


// Verify Account Balance
const accountBalance = document.getElementById('accountBalance');
const toggleBalance = document.getElementById('toggleBalance');

const verifyBalanceModel = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("verifyBalanceModal")
);
const verifyBalanceForm = document.getElementById("verifyBalanceForm");
const balancePassword = document.getElementById("balancePassword");
const message = document.getElementById("verify-balance-message");
const resetBalance = document.getElementById("resetBalance");

let balanceVisible = false;
let currentBalance = null;
toggleBalance.addEventListener('click', async () => {

    if(balanceVisible){
        accountBalance.textContent = "******";
        balanceVisible = false;
        toggleBalance.textContent = "Show Balance";
        resetBalance.classList.add("d-none");
        return;
    }

    message.textContent = "";
    balancePassword.value = "";
    verifyBalanceModel.show();
});

verifyBalanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = balancePassword.value;

    try{
        const result = await getAccountBalance(password);
        currentBalance = result.balance;
        accountBalance.textContent = currentBalance;
        balanceVisible = true;
        resetBalance.classList.remove("d-none");
        toggleBalance.textContent = "Hide Balance";

        verifyBalanceModel.hide();
    }
    catch (e){
        message.textContent = e.message;
        message.classList.add("text-danger");
        console.log(e.message);
    }
});

resetBalance.addEventListener("click", async () => {
    const result = await getBalanceOfSelectedCustomer(currentAccountId);

    currentBalance = result.balance;
    accountBalance.textContent = currentBalance;

    balanceVisible = true;
    toggleBalance.textContent = "Hide Balance";

    resetBalance.classList.remove("d-none");
});
