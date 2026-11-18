import {forgotPassword} from "../../services/forgotPasswordService.js";

const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");

const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
   const email = document.getElementById("email").value.trim();

   try{
       submitBtn.disabled = true;
       submitBtn.textContent = "Sending...";

       const result = await forgotPassword(email);

       message.innerHTML = `
            <div class="alert alert-success">
                ${result.message}
            </div>
       `;

       form.reset();
   }
   catch (e) {
       message.innerHTML = `
            <div class="alert alert-danger">
                ${e.message}
            </div>
       `;
   }
   finally {
       submitBtn.disabled = false;
       submitBtn.textContent = "Send Reset Request";
   }
});