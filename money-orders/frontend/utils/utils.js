// Transactions Helper Function
function verifyAmount(amount, element){
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

export { verifyAmount, titleCase, flattenObject };