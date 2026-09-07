import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import exampleImage from './pages/logo.jpeg';

function Layout() {
    return (
        <>
            <nav className="navbar navbar-expand-lg shadow-sm p-3 bg-white sticky-top">
                <div className="container-fluid">
                    <img src={exampleImage} alt="Logo" style={{ height: "60px", borderRadius: "10px" }} />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
                            <li className="nav-item">
                                <Link className="nav-link text-dark transition" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark transition" to="/bill">Bill</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-dark transition" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Add
                                </a>
                                <ul className="dropdown-menu shadow-sm border-0 animate__animated animate__fadeIn">
                                    <li><Link className="dropdown-item" to="/bill/add">Add Bill</Link></li>
                                    <li><Link className="dropdown-item" to="/bill">Edit Bill <small>(Click on Detail)</small></Link></li>
                                    <li><a className="dropdown-item disabled" aria-disabled="true">Payment</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="/bill/loading">Something else here</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark transition" to="/bill/about">About Us</Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input
                                className="form-control me-2 shadow-sm rounded-pill border border-dark"
                                type="search"
                                placeholder="Search..."
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-dark rounded-pill px-4 shadow-sm" type="button">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="container-fluid bg-light min-vh-100">
                <div className="row">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8 p-4 bg-white shadow rounded my-4 animate__animated animate__fadeInUp">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Layout;
