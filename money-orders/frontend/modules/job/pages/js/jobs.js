import {getJobHistory} from "../../services/jobService.js";
import {fetchMe} from "../../../dashboard/pages/js/information.js";
import {renderPagination, updatePaginationInfo} from "../../../../utils/pagination.js";
import {flattenObject} from "../../../../utils/utils.js";

const jobs = document.getElementById('jobs');
const pagination = document.getElementById('pagination');
const paginationInfo = document.getElementById('paginationInfo');
const message = document.getElementById("jobHistoryMessage");
console.log(message);

let currentPage = 1;
const limit = 10;
let totalPage = 0;

async function fetchJobHistory(page = 1) {
    try {
        pagination.innerHTML = '';
        const result = await getJobHistory(page, limit);

        console.log(result);

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

        if (result.status !== 'success') {
            throw new Error(result.message || "Failed to fetch jobs");
        }

        if (result.jobs.length === 0) {
            jobs.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            No Jobs found.
                        </td>
                    </tr>
                `;
        } else {
            jobs.innerHTML = result.jobs.map(item => `
                    <tr>
                        <td>${item.type}</td>
                        <td class="text-truncate">
                            ${(Object.entries(flattenObject(item.data))).map(([key, value]) => `<div><span class="key" style="font-weight:bold;">${key}:</span><span class="text-secondary">  ${value}</span></div>`).join('') || "-"}
                        </td>
                        <td>${item.attempts}</td>
                        <td>${item.last_error || "-"}</td>
                        <td>${new Date(item.created_at).toLocaleString('en-US', options)}
                        </td>
                        <td>${new Date(item.updated_at).toLocaleString('en-US', options)}
                        </td>
                        <td><span class="badge center rounded-pill ${item.status === 'completed' ? 'bg-success' : (item.status === 'failed' ? 'bg-danger' : 'bg-warning')}">${item.status}</span></td>
                    </tr>
                `).join('');

            renderPagination({
                container: pagination,
                currentPage,
                totalPage: totalPage,
                onPageChange: fetchJobHistory
            });
        }

        updatePaginationInfo({
            element: paginationInfo,
            currentPage,
            limit: limit,
            total: result.pagination.total || 0,
            currentCount: result.jobs.length
        });
    } catch (error) {
        message.innerText = error.message;
        message.classList.add('text-danger');
        console.log(error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchMe();
    await fetchJobHistory(1);

    setInterval(() => {
        fetchJobHistory(currentPage)
    }, 15000);
});