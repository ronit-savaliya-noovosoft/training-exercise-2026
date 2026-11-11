import {
    createAccount,
    getMyAccounts,
    selectAccount as selectAccountAPI
} from "../../services/accountService.js";

const accountsContainer = document.getElementById("accounts");
const message = document.getElementById("accountMessage");

export async function loadAccounts(){
    try{
        const result = await getMyAccounts();

        if(result.status!=="success"){
            message.textContent = "Unable to fetch accounts";
            return;
        }

        const accounts = result.accounts;

        if(accounts.length === 0){
            message.textContent = "You don't have any accounts";
            return;
        }

        accountsContainer.innerHTML = accounts.map(account => `
            <div class="account-card">
                <h4>Account Number: ${account.account_number}</h4>
                <h6 class="text-secondary">Account Holder: ${account.name}</h6>
                <p>Balance: ${account.balance}</p>
                <button class="btn btn-primary" data-account-id="${account.id}">Select Account</button>
            </div>
        `).join("");

    }
    catch (e) {
        console.error(e);
        message.textContent = "Something went wrong!";
    }
}

async function selectAccount(accountId){
    try{
        message.textContent = "Selecting account...";

        const result = await selectAccountAPI(accountId);

        if(result.status === "success"){
            window.location.href = "../../../dashboard/pages/html/dashboard.html";
        }
    }
    catch (e) {
        message.textContent = e.message;
    }
}

accountsContainer.addEventListener("click", async (e) => {
   const button = e.target.closest("[data-account-id]");

   if(!button){
       return;
   }
   await selectAccount(button.dataset.accountId);
});

loadAccounts();

const createAccountButton = document.getElementById("create-account");
createAccountButton.addEventListener("click", async (e) => {
    const message = document.getElementById("createAccountMessage");
    try{
        const result = await createAccount();

        if(result.status === "success"){
            await loadAccounts();

            const modalElement = document.getElementById("accountSuccessModal");
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

            modal.show();
        }
    }
    catch (e){
        console.log(e.message);
        message.classList.add('text-danger');
        message.textContent = e.message;
    }
});
