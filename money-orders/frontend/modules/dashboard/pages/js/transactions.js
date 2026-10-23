import {
    depositInAccount, emailTransaction,
    getTransactionHistory,
    transferFromAccount,
    withdrawFromAccount
} from "../../services/transactionService.js";
import {user_data} from "./information.js";

// Transactions
const deposit = document.getElementById('deposit');
deposit.addEventListener('click', async function deposit(e){
    e.preventDefault();

    const amountInput = document.getElementById('deposit-amount');
    const amount = amountInput.value;
    const accountId = document.getElementById('select-deposit-to').value;
    const message = document.getElementById('deposit-message');

    console.log(accountId);

    try{
        const data = await depositInAccount(accountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        amountInput.value = "";

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error){
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = error.message;
        console.log("Error:", error);
    }
});

const withdraw = document.getElementById('withdraw');
withdraw.addEventListener('click', async function withdraw(e){
    e.preventDefault();

    const amountInput = document.getElementById('withdraw-amount');
    const amount = amountInput.value;
    const accountId = document.getElementById('select-withdraw-from').value;
    const message = document.getElementById('withdraw-message');

    console.log(accountId);

    try{
        const data = await withdrawFromAccount(accountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        amountInput.value = "";

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error){
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = error.message;
        console.log("Error:", error);
    }
});

const transfer = document.getElementById('transfer');
transfer.addEventListener('click', async function transfer(e){
    e.preventDefault();

    const amountInput = document.getElementById('transfer-amount');
    const amount = amountInput.value;
    const fromAccountId = document.getElementById('select-transfer-from').value;
    const toAccountId = document.getElementById('select-transfer-to').value;
    const message = document.getElementById('transfer-message');

    console.log(fromAccountId);
    console.log(toAccountId);

    try{
        const data = await transferFromAccount(fromAccountId, toAccountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        amountInput.value = "";

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error){
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = error.message;
        console.log("Error:", error);
    }
});

// Transaction History
const transactions = document.getElementById('transactions');
const pagination = document.getElementById('pagination');
const paginationInfo = document.getElementById('paginationInfo');

let currentPage = 1;
const limit = 10;
let totalPage = 0;

export async function fetchTransactionHistory(page = 1){
    try {
        pagination.innerHTML = '';
        const result = await getTransactionHistory(page, limit);

        currentPage = result.pagination.page;
        totalPage = result.pagination.totalPages;

        if(result.status === 'success'){
            if(result.transactions.length === 0){
                transactions.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                            No transactions found.
                        </td>
                    </tr>
                `;

                paginationInfo.textContent = "Showing 0 transactions";
                renderPagination();
                return;
            }
        }

        transactions.innerHTML = result.transactions.map(item => `
            <tr class="${item.type === 'deposit' ? 'theme-success' : (item.type === 'withdraw' ? 'theme-danger' : 'theme-warning')}">
                <td>${item.type}</td>
                <td>${item.sender || "-"}</td>
                <td>${item.receiver || "-"}</td>
                <td class="">${item.amount}</td>
                <td><span  class="badge center rounded-pill ${item.status === 'completed' ? 'bg-success' : (item.status === 'failed' ? 'bg-danger' : 'bg-warning')}">${item.status}</span></td>
            </tr>
        `).join('');

        const start = (currentPage-1)*limit+1;
        const end = start + result.transactions.length-1;

        console.log(result.transactions.length);

        paginationInfo.textContent = `Showing ${start}-${end} of ${result.pagination.total} transactions`;

        renderPagination();

        console.log(result);
    }
    catch (error){
        console.log(error);
    }
}

// Pagination Helper Functions
function renderPagination(){
    pagination.innerHTML= "";

    if(totalPage<=1){
        return;
    }

    addPageButton("Previous", currentPage-1, currentPage===1);

    for(let page =1; page<=totalPage; page++){
        addPageButton(page, page, false, page === currentPage);
    }

    addPageButton("Next", currentPage+1, currentPage===totalPage);
}

function addPageButton(label, page, disabled = false, active = false){
    const li = document.createElement("li");

    li.className = `page-item${disabled ? " disabled": ""}${active ? " active": ""}`;

    const button = document.createElement("button");

    button.type= "button";
    button.className = "page-link";
    button.innerHTML = label;

    button.disabled = disabled;

    button.addEventListener("click", () => {
        fetchTransactionHistory(page);
    });

    li.appendChild(button);
    pagination.appendChild(li);
}

// Email the Transactions
export async function showFilterButton(){
    const filterForm = document.querySelector('.transaction-email-section');
    const balance_container = document.getElementById('balance-container');
    if(user_data.role === 'manager'){
        filterForm.classList.add('hidden');
        balance_container.innerHTML = '<div class="fs-lg text-secondary">0.00</div>';
    }
}

const email = document.getElementById('emailHistoryButton');
email.addEventListener("click", async function email(e) {
    const message = document.getElementById('emailHistoryMessage');
    const button = document.getElementById('emailHistoryButton');

    const records = document.getElementById('emailRecordLimit').value;
    const type = document.getElementById('emailTransactionType').value;
    const fromDate = document.getElementById('emailFromDate').value;
    const toDate = document.getElementById('emailToDate').value;

    if(fromDate && toDate && fromDate>toDate){
        message.textContent = "From date can not be after to date";
        return;
    }

    button.disabled = true;
    message.textContent = "Sending transaction history...";

    try{
        const result = await emailTransaction(records, type, fromDate, toDate);

        if(!(result.status === "success")){
            throw new Error(result.message || "Failed to send email");
        }

        message.textContent = `${result.message}: ${result.recordSent}`;
    }
    catch (e){
        message.textContent = e.message;
    }
    finally {
        button.disabled = false;
    }
});