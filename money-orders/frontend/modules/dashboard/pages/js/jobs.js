import {getJobHistory} from "../../services/jobService.js";
import {fetchMe} from "./information.js";

const jobs = document.getElementById('jobs');
const pagination = document.getElementById('pagination');
const paginationInfo = document.getElementById('paginationInfo');

let currentPage = 1;
const limit = 10;
let totalPage = 0;

export async function fetchJobHistory(page = 1){
    const message = document.getElementById("JobHistoryMessage");
    try {
        pagination.innerHTML = '';
        const result = await getJobHistory(page, limit);

        console.log(result);

        currentPage = result.pagination.page;
        totalPage = result.pagination.totalPages;

        if(result.status === 'success'){
            if(result.jobs.length === 0){
                jobs.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            No Jobs found.
                        </td>
                    </tr>
                `;

                paginationInfo.textContent = "Showing 0 jobs";
                renderPagination();
                return;
            }
        }

        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }

        jobs.innerHTML = result.jobs.map(item => `
            <tr>
                <td>${item.type}</td>
                <td>${JSON.stringify(item.data, null, "\t") || "-"}</td>
                <td>${item.attempts}</td>
                <td>${item.last_error}</td>
                <td>${new Date(item.created_at).toLocaleString('en-US', options)}
                </td>
                <td>${new Date(item.updated_at).toLocaleString('en-US', options)}
                </td>
                <td><span class="badge center rounded-pill ${item.status === 'completed' ? 'bg-success' : (item.status === 'failed' ? 'bg-danger' : 'bg-warning')}">${item.status}</span></td>
            </tr>
        `).join('');

        const start = (currentPage-1)*limit+1;
        const end = start + result.jobs.length-1;

        paginationInfo.textContent = `Showing ${start}-${end} of ${result.pagination.total} jobs`;

        renderPagination();
    }
    catch (error){
        message.innerText = error.message;
        message.classList.add('text-danger');
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

export function addPageButton(label, page, disabled = false, active = false){
    const li = document.createElement("li");

    li.className = `page-item${disabled ? " disabled": ""}${active ? " active": ""}`;

    const button = document.createElement("button");

    button.type= "button";
    button.className = "page-link";
    button.innerHTML = label;

    button.disabled = disabled;

    button.addEventListener("click", () => {
        fetchJobHistory(page);
    });

    li.appendChild(button);
    pagination.appendChild(li);
}


fetchJobHistory(1);
window.addEventListener('DOMContentLoaded', async () => {
    await fetchMe();
    setInterval(fetchJobHistory, 15000);
});