function About() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow rounded-4 border-0 animate__animated animate__fadeIn">
                        <div className="card-header bg-info text-white fs-4 fw-semibold text-center">
                            About Us
                        </div>
                        <div className="card-body p-4">
                            <h5 className="card-title text-success mb-3 fw-bold">
                                Simple CRUD Operations Project
                            </h5>
                            <p className="card-text lead text-justify">
                                We are passionate developers who created this project to showcase the fundamentals of full-stack web development using the <strong>MERN stack</strong> (MongoDB, Express.js, React, and Node.js).
                            </p>
                            <p className="card-text">
                                This application is a simple yet efficient platform that demonstrates <strong>CRUD</strong> (Create, Read, Update, Delete) operations. It provides a hands-on example of how modern web apps manage data and user interactions.
                            </p>
                            <p className="card-text">
                                Through this project, we aim to offer a clear, functional reference for building dynamic and responsive applications — ideal for learners and developers exploring the MERN ecosystem.
                            </p>
                        </div>
                        <div className="card-footer text-center text-muted small">
                            Code licensed under <strong>MIT</strong>, documentation under <strong>CC BY 3.0</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
