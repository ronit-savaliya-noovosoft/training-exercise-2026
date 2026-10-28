import {
    depositInAccount, emailTransaction,
    getTransactionHistory,
    transferFromAccount,
    withdrawFromAccount
} from "../../services/transactionService.js";
import {updatePaginationInfo, renderPagination} from "../../../../utils/pagination.js";
import {verifyAmount, titleCase} from "../../../../utils/utils.js";

const depositBtn = document.getElementById('deposit');
const withdrawBtn = document.getElementById('withdraw');
const transferBtn = document.getElementById('transfer');

depositBtn.disabled = true;
withdrawBtn.disabled = true;
transferBtn.disabled = true;

const deposit_amount = document.getElementById('deposit-amount');
const withdraw_amount = document.getElementById('withdraw-amount');
const transfer_amount = document.getElementById('transfer-amount');

deposit_amount.addEventListener('input', () => {
    depositBtn.disabled = deposit_amount.value === '';
});

withdraw_amount.addEventListener('input', () => {
    withdrawBtn.disabled = withdraw_amount.value === '';
});

transfer_amount.addEventListener('input', () => {
    transferBtn.disabled = transfer_amount.value === '';
});


// Transactions
depositBtn.addEventListener('click', async function deposit(e) {
    e.preventDefault();

    const amount = deposit_amount.value;
    const accountId = document.getElementById('select-deposit-to').value;
    const message = document.getElementById('deposit-message');

    if (!verifyAmount(amount, message)) {
        return;
    }

    try {
        const data = await depositInAccount(accountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        deposit_amount.value = "";
        depositBtn.disabled = true;

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error) {
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = error.message;
        console.log("Error:", error);
    }
});

withdrawBtn.addEventListener('click', async function withdraw(e) {
    e.preventDefault();

    const amount = withdraw_amount.value;
    const accountId = document.getElementById('select-withdraw-from').value;
    const message = document.getElementById('withdraw-message');

    if (!verifyAmount(amount, message)) {
        return;
    }

    try {
        const data = await withdrawFromAccount(accountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        withdraw_amount.value = "";
        withdrawBtn.disabled = true;

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error) {
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = error.message;
        console.log("Error:", error);
    }
});

transferBtn.addEventListener('click', async function transfer(e) {
    e.preventDefault();

    const amount = transfer_amount.value;
    const fromAccountId = document.getElementById('select-transfer-from').value;
    const toAccountId = document.getElementById('select-transfer-to').value;
    const message = document.getElementById('transfer-message');

    if (!verifyAmount(amount, message)) {
        return;
    }

    try {
        const data = await transferFromAccount(fromAccountId, toAccountId, amount);

        message.classList.remove('text-danger');
        message.classList.add('text-success');
        transfer_amount.value = "";
        transferBtn.disabled = true;

        fetchTransactionHistory();
        message.textContent = data.message;
    } catch (error) {
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

export let currentPage = 1;
const limit = 10;
let totalPage = 0;

export async function fetchTransactionHistory(page = 1) {
    const message = document.getElementById("transactionHistoryMessage");
    try {
        pagination.innerHTML = '';
        const result = await getTransactionHistory(page, limit);

        currentPage = result.pagination.page;
        totalPage = result.pagination.totalPages;

        if (result.status !== 'success') {
            throw new Error(result.message || "Failed to fetch Transactions");
        }

        if (result.transactions.length === 0) {
            transactions.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No transactions found.
                    </td>
                </tr>
            `;
        } else {
            transactions.innerHTML = result.transactions.map(item => `
                    <tr>
                        <td>${titleCase(item.type)}</td>
                        <td>${item.sender || "-"}</td>
                        <td>${item.receiver || "-"}</td>
                        <td class="">${item.amount}</td>
                        <td><span class="badge center rounded-pill ${item.status === 'completed' ? 'bg-success' : (item.status === 'failed' ? 'bg-danger' : 'bg-warning')}">${item.status}</span></td>
                    </tr>
                `).join('');

            renderPagination({
                container: pagination,
                currentPage,
                totalPage: totalPage,
                onPageChange: fetchTransactionHistory
            });
        }

        updatePaginationInfo({
            element: paginationInfo,
            currentPage,
            limit: limit,
            total: result.pagination.total || 0,
            currentCount: result.transactions.length
        });
    } catch (error) {
        message.classList.add('text-danger');
        message.innerText = error.message;
        console.log(error);
    }
}

// Email the Transactions
export async function showFilterButton(user_data) {
    const filterForm = document.querySelector('.transaction-email-section');
    const balance_container = document.getElementById('balance-container');
    if (user_data.role === 'manager') {
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

    if (records === "" || Number(records) <= 0) {
        message.textContent = "Please enter how many transaction you need, Empty or negative value not allowed";
        return;
    }

    if (fromDate && toDate && fromDate > toDate) {
        message.textContent = "From date can not be after to date";
        return;
    }

    button.disabled = true;
    message.textContent = "Sending transaction history...";

    try {
        const result = await emailTransaction(records, type, fromDate, toDate);
        message.textContent = `${result.message}`;
    } catch (e) {
        message.textContent = e.message;
    } finally {
        button.disabled = false;
    }
});