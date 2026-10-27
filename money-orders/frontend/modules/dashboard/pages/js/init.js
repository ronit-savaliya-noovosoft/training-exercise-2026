import {fetchMe} from "./information.js";
import {fetchAndDisplayAccounts, updateTransferToDropdown} from "./accounts.js";
import {fetchTransactionHistory, showFilterButton} from "./transactions.js";

window.addEventListener('DOMContentLoaded', async (e) => {
    const user_data = await fetchMe();
    await fetchAndDisplayAccounts(user_data);
    await updateTransferToDropdown();
    await showFilterButton(user_data);
});

fetchTransactionHistory(1);
window.addEventListener('DOMContentLoaded', async (e) => {
   setInterval(fetchTransactionHistory, 15000);
});