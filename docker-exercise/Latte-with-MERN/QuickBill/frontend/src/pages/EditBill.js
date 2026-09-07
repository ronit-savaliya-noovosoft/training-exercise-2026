import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditBill() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const { _id } = useParams();

    const apiUrl = "/api/bill/" + _id;

    useEffect(() => {
        fetch(apiUrl, { method: "GET" })
            .then(res => res.json())
            .then(res => setData(res));
    }, []);

    const handleSubmit = () => {
        fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => navigate('/bill/' + _id));
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow rounded-4 border-0">
                        <div className="card-header bg-warning text-white text-center fs-5">
                            Edit Bill
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-3 form-floating">
                                <input
                                    type="text"
                                    id="companyName"
                                    className="form-control"
                                    placeholder="Company Name"
                                    value={data.companyName || ""}
                                    onChange={(e) =>
                                        setData({ ...data, companyName: e.target.value })
                                    }
                                    required
                                />
                                <label htmlFor="companyName">Company Name</label>
                            </div>

                            <div className="mb-3 form-floating">
                                <input
                                    type="number"
                                    id="amount"
                                    className="form-control"
                                    placeholder="Amount"
                                    value={data.amount || ""}
                                    onChange={(e) =>
                                        setData({ ...data, amount: e.target.value })
                                    }
                                    required
                                />
                                <label htmlFor="amount">Amount</label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter bill description"
                                    value={data.description || ""}
                                    onChange={(e) =>
                                        setData({ ...data, description: e.target.value })
                                    }
                                ></textarea>
                            </div>

                            <div className="mb-3 form-floating">
                                <input
                                    type="date"
                                    id="date"
                                    className="form-control"
                                    placeholder="Date"
                                    value={data.date || ""}
                                    onChange={(e) =>
                                        setData({ ...data, date: e.target.value })
                                    }
                                    required
                                />
                                <label htmlFor="date">Date</label>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    className="form-select"
                                    value={data.status || ""}
                                    onChange={(e) =>
                                        setData({ ...data, status: e.target.value })
                                    }
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-warning rounded-pill"
                                    onClick={handleSubmit}
                                >
                                    Update Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBill;
