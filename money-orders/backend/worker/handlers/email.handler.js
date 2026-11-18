const transactionRepository = require("../../repositories/transaction.repository");
const authRepository = require("../../repositories/auth.repository");
const transporter = require("../../config/email");

async function handleTransactionEmail(job){
    const { user, filters } = job.data;
    const { limit = 10, type, fromDate, toDate } = filters;

    const transactions = await transactionRepository.getTransactionsForEmail(
        user.id,
        !type || type === "all" ? null : type,
        fromDate || null,
        toDate || null,
        user.accountId,
        limit
    );

    const rows = transactions.map((transaction)=>
    `
        <tr>
            <td>${transaction.id}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.sender}</td>
            <td>${transaction.receiver}</td>
            <td>${new Date(transaction.created_at).toLocaleString()}</td>
        </tr>
    `
    ).join("");

    let html;
    if (transactions.length === 0){
        html = `<h3>No Transaction found for selected filter</h3>`;
        console.error("No Transaction found for selected filter");
    }
    else {
        html = `
            <h2>Your Transaction History</h2>
            <p>Hello! ${user.name},</p>
            <p>Here are you latest transactions matching your selected filter.</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>From Account</th>
                        <th>To Account</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <p>Records included: ${transactions.length}</p>
        `;
    }

    await transporter.sendMail({
        from: '"Banking App" <banking-app@localhost>',
        to: user.email,
        subject: "Your Transaction History",
        html: html
    });
}

async function handleAccountEmail(job){
    const { account } = job.data;

    const customer = await authRepository.getUserProfile(account.holderId);
    let html;

    if(account.status==="approved"){
        html = `
            <h3>Dear ${customer.name || "Customer"},</h3>
            <p>Your request for account creation is approved, you can check you account now.</p>
            <p>Approved by your bank manager, ${account.managerName || ""}</p>
            <br />
            <h4>Account Details</h4>
            <ul>
                <li>Account Holder: ${customer.name}</li>
                <li>Account Number: ${account.accountNumber || "**** **** **** ****"}</li>
                <li>Email: ${customer.email}</li>
            </ul>
            <a href="http://localhost:8080/modules/account/pages/html/selectAccount.html">Accounts Link</a>
        `;
    }
    else if(account.status==="cancelled"){
        html = `
            <h3>Dear ${customer.name},</h3>
            <p>Due to some reason your account request has been cancelled, contact your back manager.</p>
            <a href="http://localhost:8080/modules/account/pages/html/selectAccount.html">Accounts Link</a>
        `;
    }

    await transporter.sendMail({
        from: '"Banking App" <banking-app@localhost>',
        to: customer.email,
        subject: "Account Request",
        html: html
    });
}

module.exports = {
    handleTransactionEmail,
    handleAccountEmail
};