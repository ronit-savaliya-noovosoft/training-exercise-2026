import {renderPagination, updatePaginationInfo} from "../../../../utils/pagination.js";
import {deactivateAccount as deactivateAccountAPI, getAllAccounts} from "../../services/accountService.js";
import {debounce} from "../../../../utils/utils.js";

const accounts = document.getElementById('accounts');
const pagination = document.getElementById('pagination');
const paginationInfo = document.getElementById('paginationInfo');
const message = document.getElementById("accountsHistoryMessage");
const searchInput = document.getElementById('searchInput');

let currentPage = 1;
const limit = 10;
let totalPage = 0;

async function fetchAccounts(page = 1) {
    try {
        const query = searchInput.value.toLowerCase().trim();
        const result = await getAllAccounts(page, limit, query);

        if (result.status !== 'success') {
            throw new Error(result.message || "Failed to fetch accounts");
        }

        renderTable(result);
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('text-danger');
        console.log(error);
    }
}

accounts.addEventListener("click", async (e) => {
    const button = e.target.closest("[data-account-id]");

    if(!button){
        return;
    }

    const selectedAccountId = button.dataset.accountId;
    const result = await deactivateAccountAPI(selectedAccountId);

    if(result.status === "success"){
        await fetchAccounts();
    }
});


function renderTable(result){
    pagination.innerHTML = '';

    currentPage = result.pagination.page;
    totalPage = result.pagination.totalPages;
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }

    if (result.accounts.length === 0) {
        accounts.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                            No Accounts found.
                        </td>
                    </tr>
                `;
    } else {
        accounts.innerHTML = result.accounts.map(item => `
                    <tr>
                        <td>${item.account_number}</td>
                        <td>
                            <span data-bs-toggle="tooltip"
                               data-bs-placement="bottom"
                               data-bs-custom-class="account-tooltip"
                               title="${item.email}"
                               style="cursor: pointer;">${item.name || "-"}</span>
                        </td>
                        <td>${item.balance}</td>
                        <td>${new Date(item.created_at).toLocaleString('en-US', options)}</td>
                        <td>
                            <button class="btn ${item.is_active? "btn-outline-danger": "btn-outline-success"} btn-sm" data-account-id="${item.id}">${item.is_active? "Deactivate": "Activate"}</button>
                        </td>
                    </tr>
                `).join('');

        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
            new bootstrap.Tooltip(element);
        });

        renderPagination({
            container: pagination,
            currentPage,
            totalPage: totalPage,
            onPageChange: fetchAccounts
        });
    }

    updatePaginationInfo({
        element: paginationInfo,
        currentPage,
        limit: limit,
        total: result.pagination.total || 0,
        currentCount: result.accounts.length
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchAccounts(1);
});

const debouncedSearch = debounce(() => {
    fetchAccounts(1);
}, 400);

searchInput.addEventListener('input', debouncedSearch);
