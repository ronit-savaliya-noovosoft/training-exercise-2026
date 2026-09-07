import bgImage from './bg.jpg'

function Home(){
    return(
        <>
            <div class="card text-bg-dark">
                <img src={bgImage}  style={{height: "580px"}} class="card-img" alt="..." />
                <div class="card-img-overlay">
                    <h2 class="card-title">Welcome to My Web Page</h2>
                    <br/>
                    <p class="card-text h5">The Bill CRUD App is a user-friendly web application designed to manage billing records efficiently through essential CRUD (Create, Read, Update, Delete) operations. This app enables users to handle bill-related data such as customer names, bill amounts, due dates, and payment status, providing a seamless interface for tracking and maintaining billing information.</p>
                    <p class="card-text"><small>Last updated 3 mins ago</small></p>
                </div>
            </div>
        </>
    )
}

export default Home;