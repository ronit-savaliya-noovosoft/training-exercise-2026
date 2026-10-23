import {fetchMe} from "./information.js";
import {fetchAndDisplayAccounts, updateTransferToDropdown} from "./accounts.js";
import {fetchTransactionHistory, showFilterButton} from "./transactions.js";

window.addEventListener('DOMContentLoaded', async (e) => {
    await fetchMe(e);
    await fetchAndDisplayAccounts(e);
    await updateTransferToDropdown();
    await showFilterButton();
});

fetchTransactionHistory(1);
// window.addEventListener('DOMContentLoaded', async (e) => {
//    setInterval(fetchTransactionHistory, 15000);
// });