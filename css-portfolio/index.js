const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event){

    event.preventDefault();

   const name = document.getElementById("name").value;
   const email = document.getElementById("email").value;
   const message = document.getElementById("message").value;

   const data = {
       name: name,
       email: email,
       message: message
   }

   // localStorage.setItem("name", name);
   // localStorage.setItem("email", email);
   // localStorage.setItem("message", message);

   localStorage.setItem("data", JSON.stringify(data));

   form.reset();
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