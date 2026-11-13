import {
    createAccount,
    getMyAccounts,
    selectAccount as selectAccountAPI,
    deactivateAccount as deactivateAccountAPI
} from "../../../account/services/accountService.js";

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
                <div class="d-flex gap-3">
                    <button class="btn btn-primary" data-account-id="${account.id}">Select Account</button>
                    <button class="btn btn-outline-danger" data-deactivate-id="${account.id}">Deactivate</button>
                </div>
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

const deactivateModal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("deactivateAccountModal")
);

const confirmDeactivate = document.getElementById("confirmDeactivate");
const deactivateAccountMessage = document.getElementById("deactivateAccountMessage");

let selectedAccountId = null;

accountsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("[data-deactivate-id]");

    if(!button){
        return;
    }

    selectedAccountId = button.dataset.deactivateId;

    deactivateAccountMessage.textContent = "";
    deactivateModal.show();
});

confirmDeactivate.addEventListener("click", async () => {
   try{
       confirmDeactivate.disabled = true;
       confirmDeactivate.textContent ="Deactivating...";

       const result = await deactivateAccountAPI(selectedAccountId);

       if(result.status === "success"){
           deactivateModal.hide();
           selectedAccountId = null;

           await loadAccounts();
       }
   }
   catch (e){
       deactivateAccountMessage.textContent = e.message;
       deactivateAccountMessage.classList.add("text-danger");
   }
   finally {
       confirmDeactivate.disabled = false;
       confirmDeactivate.textContent = "Deactivate";
   }
});