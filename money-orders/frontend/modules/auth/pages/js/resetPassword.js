import {resetPassword} from "../../services/forgotPasswordService.js";

const form = document.getElementById("resetPasswordForm");
const message = document.getElementById("message");

const submitBtn = document.getElementById("submitBtn");

const params = new URLSearchParams(window.location.search);

const token = params.get("token");

if(!token){
    form.classList.add("d-none");

    message.innerHTML = `
        <div class="alert alert-danger">
            Invalid password reset link.
        </div>
    `;
}

form.addEventListener("submit", async (e) => {
   e.preventDefault();

   const newPassword = document.getElementById("newPassword").value;
   const confirmPassword = document.getElementById("confirmPassword").value;

   if(newPassword!==confirmPassword){
       message.innerHTML = `
            <div class="alert alert-danger">
                Password do not match.
            </div>
       `;
   }

   try {
       submitBtn.disabled = true;
       submitBtn.textContent = "Updating...";

       console.log(token, newPassword);

       const result = await resetPassword(token, newPassword);

       message.innerHTML = `
            <div class="alert alert-success">
                ${result.message}
                <div class="mt-2">
                    <a href="login.html">Go to Login</a>
                </div>
            </div>
       `;

       form.classList.add("d-none");
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
       submitBtn.textContent = "Reset Password";
   }
});