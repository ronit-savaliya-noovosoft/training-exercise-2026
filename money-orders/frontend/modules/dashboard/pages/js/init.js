import {fetchMe} from "./information.js";
import {fetchAndDisplayAccounts, showFilterMessage, updateTransferToDropdown} from "./accounts.js";
import {currentPage, fetchTransactionHistory, showFilterButton} from "./transactions.js";

window.addEventListener('DOMContentLoaded', async (e) => {
    const user_data = await fetchMe();
    await fetchAndDisplayAccounts(user_data);
    await updateTransferToDropdown(user_data);
    await showFilterButton(user_data);
    await showFilterMessage(user_data);
    await fetchTransactionHistory(1);
});

window.addEventListener('DOMContentLoaded', async (e) => {
   setInterval(() => {
       fetchTransactionHistory(currentPage);
   }, 15000);
});