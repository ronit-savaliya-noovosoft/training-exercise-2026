import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function DetailBill() {
    const [data, setData] = useState({});
    const { _id } = useParams();
    const navigate = useNavigate();

    const apiUrl = "/api/bill/" + _id;

    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(res => setData(res))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDelete = () => {
        fetch(apiUrl, { method: "DELETE" })
            .then(res => res.json())
            .then(() => navigate('/bill'));
    };

    return (
        <>
            <div className="container mt-4">
                <div className="card shadow rounded-4 border-0 animate__animated animate__fadeIn">
                    <div className="card-header bg-success text-white fs-5 fw-bold">
                        {data.companyName}
                    </div>
                    <div className="card-body">
                        <blockquote className="blockquote mb-4">
                            <p className="mb-3">
                                <strong className="text-muted">Description:</strong><br />
                                {data.description}
                            </p>
                            <p className="mb-3">
                                <strong className="text-muted">Amount:</strong><br />
                                ₹{data.amount}
                            </p>
                            <p className="mb-3">
                                <strong className="text-muted">Date:</strong><br />
                                {data.date}
                            </p>
                            <footer className="blockquote-footer text-capitalize">
                                Status: <cite>{data.status}</cite>
                            </footer>
                        </blockquote>
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-4 gap-3">
                    <Link to="/bill" className="btn btn-outline-secondary px-4 rounded-pill">Back</Link>
                    <Link to={`/bill/edit/${_id}`} className="btn btn-outline-warning px-4 rounded-pill">Edit</Link>
                    <button onClick={handleDelete} className="btn btn-outline-danger px-4 rounded-pill">Delete</button>
                </div>
            </div>
        </>
    );
}

export default DetailBill;
