const transactionRepository = require("../../repositories/transaction.repository");
const transporter = require("../../config/email");

async function handleEmail(job){
    const { user, filters } = job.data;
    const { limit = 10, type, fromDate, toDate } = filters;

    const transactions = await transactionRepository.getTransactionsForEmail(
        user.id,
        !type || type === "all" ? null : type,
        fromDate || null,
        toDate || null,
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

module.exports = { handleEmail };