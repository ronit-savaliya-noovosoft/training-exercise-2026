// Transactions Helper Function
import {getBalanceOfSelectedCustomer} from "../modules/dashboard/services/accountService.js";

async function verifyAmount(amount, element, accountId, type='withdraw'){
    if(amount===""){
        element.classList.remove('text-success');
        element.classList.add('text-danger');
        element.textContent = "Amount is required";
        return false;
    }
    else if(amount<=0){
        element.classList.remove('text-success');
        element.classList.add('text-danger');
        element.textContent = "Invalid Amount";
        return false;
    }
    else {
        const result = await getBalanceOfSelectedCustomer(accountId);

        if(Number(result.balance)<Number(amount) && type !== 'deposit'){
            element.classList.remove('text-success');
            element.classList.add('text-danger');
            element.textContent = "Insufficient Balance";

            return false;
        }

    }

    return true;
}

function titleCase(s) {
    return s.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Function for flat object
function flattenObject(ob){
    let result = {};

    for (const i in ob) {
        if(ob[i] === null){
            continue;
        }

        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = flattenObject(ob[i]);
            for (const j in temp) {
                result[i + '.' + j] = temp[j];
            }
        } else {
            result[i] = ob[i];
        }
    }
    return result;
}

function debounce(func, delay = 400) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export { verifyAmount, titleCase, flattenObject, debounce };