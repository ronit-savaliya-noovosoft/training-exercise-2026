import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import exampleImage from './image.jpeg';

function Bill() {

    const [data, setData] = useState([]);

    const apiUrl = "/api/bill";

    useEffect(() => {
        fetch(apiUrl, { method: "GET" })
            .then(res => res.json())
            .then(res => setData(res));
    }, []);

    const formattedBill = data.map((bill) => {
        return (
            <div className="col-md-6 col-lg-4 mb-4 d-flex justify-content-center" key={bill._id}>
                <div className="card shadow rounded-4 border-0 bill-card" style={{ width: "100%", maxWidth: "20rem" }}>
                    <img src={exampleImage} className="card-img-top rounded-top" alt="Company" />
                    <div className="card-body text-start">
                        <h5 className="card-title text-success">{bill.companyName}</h5>
                        <p className="card-text fw-semibold">Amount: ₹{bill.amount}</p>
                        <Link to={`/bill/${bill._id}`} className="btn btn-outline-success w-100 rounded-pill">
                            View Detail
                        </Link>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <>
            <div className="container py-4">
                <h2 className="text-center mb-4 text-dark">Bill Dashboard</h2>
                <div className="row">
                    {formattedBill}
                </div>
            </div>
        </>
    );
}

export default Bill;
