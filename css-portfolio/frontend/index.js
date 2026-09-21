const form = document.getElementById("contactForm");


// ================================================================================

// form.addEventListener("submit", function (event){
//
//     event.preventDefault();
//
//    const name = document.getElementById("name").value;
//    const email = document.getElementById("email").value;
//    const message = document.getElementById("message").value;
//
//    const data = {
//        name: name,
//        email: email,
//        message: message
//    }
//
//    // localStorage.setItem("name", name);
//    // localStorage.setItem("email", email);
//    // localStorage.setItem("message", message);
//
//    localStorage.setItem("data", JSON.stringify(data));
//
//    form.reset();
// });

// ================================================================================

const listContainer = document.getElementById('submissionsList');
const customerContainer = document.getElementById('customerList');

async function fetchAndDisplayData() {
    try {
        const response = await fetch('http://localhost:5000/api/submissions');
        const result = await response.json();

        console.log(result);

        if (result.status === 'success') {
            if (result.data.length === 0) {
                listContainer.innerHTML = '<p>No entries found yet.</p>';
                return;
            }

            listContainer.innerHTML = result.data.map(item => `
                <div class="submission-card">
                    <div class="card-field">${item.name || 'N/A'}</div>
                    <div class="card-field" style="font-size: small">${item.email || 'N/A'}</div>
                    <div class="card-field" style="font-size: medium">${item.message || 'N/A'}</div>
                    <button class="delete-btn" onclick="deleteSubmission('${item.id}')">Delete</button>
                </div>
            `).join('');

        } else {
            listContainer.innerHTML = '<p style="color:red;">Error loading data.</p>';
        }
    } catch (err) {
        listContainer.innerHTML = '<p style="color:red;">Could not connect to server.</p>';
    }
}

async function fetchContacts(){
    try{
        const response = await fetch('http://localhost:5000/api/contacts');
        const result = await response.json();

        console.log(result);
        if (result.status === 'success') {
            if (result.data.length === 0) {
                customerContainer.innerHTML = '<p>No entries found yet.</p>';
                return;
            }

            customerContainer.innerHTML = result.data.map(item => `
                <div class="customer-card">
                    <div class="card-icon">
                        <img src="images/user-icon.png" alt="user">
                    </div>
                    <div class="card-field name">${item.name || 'N/A'}</div>
                    <div class="card-field email">${item.email || 'N/A'}</div>
                </div>
            `).join('');


        } else {
            customerContainer.innerHTML = '<p style="color:red;">Error loading data.</p>';
        }
    } catch (err) {
        customerContainer.innerHTML = '<p style="color:red;">Could not connect to server.</p>';
    }
}

async function deleteSubmission(id) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/submissions/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.status === 'success') {
            await fetchAndDisplayData();
            await fetchContacts();
        } else {
            alert('Error deleting item: ' + result.message);
        }
    } catch (err) {
        alert('Network error occurred while trying to delete.');
    }
}


form.addEventListener('submit', async (e) => {
   e.preventDefault();

   const formData = {
       name: document.getElementById("name").value,
       email: document.getElementById("email").value,
       message: document.getElementById("message").value
   };

   try{
       const response = await fetch('http://localhost:5000/api/submit', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(formData)
       })

       const result = await response.json();

       if(result.status === 'success'){
           console.log("Done!");
           await fetchAndDisplayData();
           await fetchContacts();
           form.reset();
       }
       else {
           alert("Error saving data: "+ result.message);
       }
   }
   catch (err){
       alert('Error!');
   }
});


const modal = document.getElementById('popupModal');
const closeBtn = document.getElementById('closeBtn');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    modal.classList.remove('hidden');
});

closeBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
});

window.addEventListener('DOMContentLoaded', fetchAndDisplayData);
window.addEventListener('DOMContentLoaded', fetchContacts);