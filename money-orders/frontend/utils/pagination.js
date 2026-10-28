// Pagination Helper Functions
function renderPagination({container, currentPage, totalPage, onPageChange}){
    container.innerHTML= "";

    if(totalPage<=1){
        return;
    }

    addPageButton(container, "Previous", currentPage-1, currentPage===1, false, onPageChange);

    for(let page =1; page<=totalPage; page++){
        addPageButton(container, page, page, false, page === currentPage, onPageChange);
    }

    addPageButton(container, "Next", currentPage+1, currentPage===totalPage, false, onPageChange);
}

function addPageButton(container, label, page, disabled = false, active = false, onPageChange){
    const li = document.createElement("li");

    li.className = `page-item${disabled ? " disabled": ""}${active ? " active": ""}`;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "page-link";
    button.innerHTML = label;

    button.disabled = disabled;

    button.addEventListener("click", () => {
        onPageChange(page);
    });

    li.appendChild(button);
    container.appendChild(li);
}

function updatePaginationInfo({element, currentPage, limit, total, currentCount}){
    if(total<=0){
        element.textContent = "Showing 0 transactions";
        return;
    }

    const start = (currentPage-1)*limit+1;
    const end = start + currentCount-1;

    element.textContent = `Showing ${start}-${end} of ${total} transactions`;
}

export { renderPagination, addPageButton, updatePaginationInfo };