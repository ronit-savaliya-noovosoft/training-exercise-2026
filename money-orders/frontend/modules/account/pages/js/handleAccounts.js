import {renderPagination, updatePaginationInfo} from "../../../../utils/pagination.js";
import {
    cancelAccountRequest,
    createAccount,
    deactivateAccount as deactivateAccountAPI,
    getAllAccounts,
    getPendingAccountRequests
} from "../../services/accountService.js";
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


// Pending Requests
const pendingRequestsModal = document.getElementById("pendingRequestsModal");
const pendingRequestsTable = document.getElementById("pendingRequestsTable");
const pendingRequestsMessage = document.getElementById("pendingRequestsMessage");


async function loadPendingRequests(){
    try{
        pendingRequestsTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">Loading Requests...</td>
            </tr>
        `;

        pendingRequestsMessage.textContent = "";
        const result = await getPendingAccountRequests();


        if(result.status !== "success"){
            throw new Error(result.message || "Unable to fetch requests");
        }

        if(result.requests.length === 0){
            pendingRequestsTable.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">No pending requests found.</td>
                </tr>
            `;
            return;
        }

        console.log(result.requests);
        pendingRequestsTable.innerHTML = result.requests.map(request => `
                    <tr>
                        <td>${request.data.name}</td>
                        <td>${request.data.email}</td>
                        <td class="text-center">
                             <button class="btn btn-sm btn-success" data-action="approve" data-user-id="${Number(request.data.userId)}" data-request-id="${Number(request.id)}">Approve</button>
                             <button class="btn btn-sm btn-outline-danger" data-action="cancel" data-user-id="${Number(request.data.userId)}" data-request-id="${Number(request.id)}">Cancel</button>
                        </td>
                    </tr>
                `).join('');
    }
    catch (e) {
        pendingRequestsTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">${e.message}</td>
            </tr>
        `;
    }
}

pendingRequestsModal.addEventListener("show.bs.modal", ()=>{
    loadPendingRequests();
});

pendingRequestsTable.addEventListener("click", async (e) => {
   const button = e.target.closest("[data-action]");

   if(!button){
       return;
   }

    const action = button.dataset.action;
    const requestId = button.dataset.requestId;
    const userId = button.dataset.userId;

    try{
       button.disabled = true;

       if(action === "approve"){
           await createAccount(userId, requestId);
       }
       else if(action === "cancel"){
           await cancelAccountRequest(userId, requestId);
       }

       await loadPendingRequests();
   }
   catch (e){
       pendingRequestsMessage.classList.add("text-danger");
       pendingRequestsMessage.textContent = e.message;
       button.disabled = false;
   }
});