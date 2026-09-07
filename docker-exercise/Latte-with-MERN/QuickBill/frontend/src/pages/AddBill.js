import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBill() {
    const [data, setData] = useState({});
    const navigate = useNavigate();

    const handleSubmit = () => {
        const apiUrl = "/api/bill";

        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => {
                navigate('/bill');
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow rounded-4 border-0">
                        <div className="card-header bg-success text-white text-center fs-5">
                            Add New Bill
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-3 form-floating">
                                <input
                                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                                    type="text"
                                    className="form-control"
                                    id="companyName"
                                    placeholder="Company Name"
                                    required
                                />
                                <label htmlFor="companyName">Company Name</label>
                            </div>

                            <div className="mb-3 form-floating">
                                <input
                                    onChange={(e) => setData({ ...data, amount: e.target.value })}
                                    type="number"
                                    className="form-control"
                                    id="amount"
                                    placeholder="Amount"
                                    required
                                />
                                <label htmlFor="amount">Amount</label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    className="form-control"
                                    id="description"
                                    placeholder="Enter bill description"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="mb-3 form-floating">
                                <input
                                    onChange={(e) => setData({ ...data, date: e.target.value })}
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    placeholder="Date"
                                    required
                                />
                                <label htmlFor="date">Date</label>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    onChange={(e) => setData({ ...data, status: e.target.value })}
                                    className="form-select"
                                    id="status"
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="d-grid">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="btn btn-success rounded-pill"
                                >
                                    Submit Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBill;
