import './DashBoard.css'
import joshuagrad from '../assets/joshuagrad.jpg'
import SideBar from './SideBar'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashBoard() {

const [ userData, setUserData ] = useState([]);
const [ application, setApplication ] = useState([]);

useEffect(() => {

    const getProfile = async () => {

    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
        credentials: "include"
    });

    const data = await response.json();

    if(!response.ok) {
        console.error(data.message);
        return;
    }

    setUserData(data);
    }catch(err) {
        console.error(err);
    }

    }

getProfile();

}, []);

useEffect(() => {

    const getApplication = async () => {

        try {

            const response = await fetch('http://localhost:3000/api/user/application', {
                credentials: "include"
            });

            const data = await response.json();

            if(!response.ok) {
                console.error(data.message);
                return;
            }

            setApplication(data);

        }catch(err) {
            console.log(`Frontend Error: ${err.message}`);
        }

    }

    getApplication();

}, []);


const total = application.length;
const pending = application.filter((data) => data.job_status === "Pending").length;
const interview = application.filter((data) => data.job_status === "Interview").length;
const offered = application.filter((data) => data.job_status === "Offered").length;
const rejected = application.filter((data) => data.job_status === "Rejected").length;

const pendingPercent = total ? (pending / total) * 100 : 0;
const interviewPercent = total ? (interview / total) * 100 : 0;
const offeredPercent = total ? (offered / total) * 100 : 0;
const rejectedPercent = total ? (rejected / total) * 100 : 0;

const pendingEnd = pendingPercent;
const interviewEnd = pendingEnd + interviewPercent;
const offeredEnd = interviewEnd + offeredPercent;
const rejectedEnd = offeredEnd + rejectedPercent;

    return (
        <>
            <section className=" dashboard">
                <SideBar/>

                <main className="main-content border">
                   <div className="border profile">
                    <div className="border">
                        <h2>Welcome, {userData[0]?.first_name} {userData[0]?.last_name}</h2>
                        <p>Here's what happening with your job search today.</p>
                    </div>
                    <div className="profile-container">
                        <Link>+ Add Application</Link>
                        <img src={joshuagrad} className="picture"/>
                    </div>
                   </div>

                 <div className="statistics-container">
                   <div className="border card-container">
                     <div className=" card">
                        <div>
                         <img src={joshuagrad} className="picture"/>
                        </div>
                        <div className="status">
                            <p>Applications</p>
                            <h3>{application.length}</h3>
                            <p>Total Applied</p>
                            <p>This Week</p>
                        </div>
                     </div>
                     <div className="card">
                        <div>
                         <img src={joshuagrad} className="picture"/>
                        </div>
                        <div className="status">
                            <p>In Progress</p>
                            <h3>
                                {application.filter((data) => data.job_status === "Pending").length}
                            </h3>
                            <p>Total Applied</p>
                            <p>This Week</p>
                        </div>
                     </div>
                     <div className=" card">
                        <div>
                         <img src={joshuagrad} className="picture"/>
                        </div>
                        <div className="status">
                            <p>Interviews</p>
                            <h3>{application.filter((data) => data.job_status === "Interview").length}</h3>
                            <p>Total Applied</p>
                            <p>This Week</p>
                        </div>
                     </div>
                     <div className=" card">
                        <div>
                         <img src={joshuagrad} className="picture"/>
                        </div>
                        <div className="status">
                            <p>Offers</p>
                            <h3>{application.filter((data) => data.job_status === "Offered").length}</h3>
                            <p>Total Applied</p>
                            <p>This Week</p>
                        </div>
                     </div>
                      <div className=" card">
                        <div>
                         <img src={joshuagrad} className="picture"/>
                        </div>
                        <div className="status">
                            <p>Rejected</p>
                            <h3>{application.filter((data) => data.job_status === "Rejected").length}</h3>
                            <p>Total Applied</p>
                            <p>This Week</p>
                        </div>
                     </div>
                   </div>

                   <div className="border overview">
                    <div className="overview-contain">
                        <div className="border overview-container">
                            <p>Application Status Overview</p>
                            <p>This Month</p>
                        </div>
                        <div className="statistics">

                       <div
                        className="chart"
                        style={{
                            background:
                                total === 0
                                    ? "#e9e9e9"
                                    : `conic-gradient(
                                    
                                        #4f8df7 0% ${pendingEnd}%,
                                        #f5a623 ${pendingEnd}% ${interviewEnd}%,
                                        #35b779 ${interviewEnd}% ${offeredEnd}%,
                                        #f05b78 ${offeredEnd}% ${rejectedEnd}%,
                                        #e9e9e9 ${rejectedEnd}% 100%
                                    )`
                        }}>
                        <div className="chart-center">
                            <h3>{total}</h3>
                            <p>Total</p>
                        </div>
                    </div>


                        <div className="status-names">
                            <p>
                            <span className="status-dot applied"></span>
                            Applied
                            </p>
                            <p>
                            <span className="status-dot pending"></span>
                            In Progress
                            </p>
                            <p>
                            <span className="status-dot interview"></span>
                            Interviews
                            </p>
                            <p>
                            <span className="status-dot offered"></span>
                            Offers
                            </p>
                            <p>
                            <span className="status-dot rejected"></span>
                            Rejected
                            </p>
                        </div>


                        <div className="status-numbers">
                            <p>
                            {total} (100%)
                            </p>
                            <p>
                            {pending} ({pendingPercent.toFixed(1)}%)
                            </p>
                            <p>
                            {interview} ({interviewPercent.toFixed(1)}%)
                            </p>
                            <p>
                            {offered} ({offeredPercent.toFixed(1)}%)
                            </p>
                            <p>
                            {rejected} ({rejectedPercent.toFixed(1)}%)
                            </p>
                        </div>
                    </div>
                    </div>

                    <div className="overview-contain">
                        <div className="border overview-container">
                            <p>Upcoming Events</p>
                            <p>View Calendar</p>
                        </div>
                        <div className="statistics">
                            <div>
                                <h3>24</h3>
                                <p>Total</p>
                            </div>
                            <div>
                                <p>Applied</p>
                                <p>In Progress</p>
                                <p>Interviews</p>
                                <p>Offers</p>
                                <p>Rejected</p>
                            </div>
                            <div>
                                <p>24 (50%)</p>
                                <p>8 (16.7%)</p>
                                <p>3 (12.5%)</p>
                                <p>1 (4.2%)</p>
                                <p>12 (25%)</p>
                            </div>
                        </div>
                    </div>
                   </div>

                   <div className="border applications">
                        <div className="applications-contain">

                            <div className="applications-header">
                                <p>Recent Applications</p>
                                <p>View All</p>
                            </div>

                            <div className="applications-table">
                                <div className="application-row application-header">
                                    <p>Company</p>
                                    <p>Position</p>
                                    <p>Status</p>
                                    <p>Applied</p>
                                    <p>Next Step</p>
                                </div>

                                {application.map((data, index) => (
                                    index < 2 && (
                                         <div className="application-row" key={data.index}>
                                            <p>{data.company}</p>
                                            <p>{data.job_title}</p>
                                            <p>
                                            <span className="status-interview">
                                                {data.job_status}
                                            </span>
                                            </p>
                                            <p> {new Date(data.date_applied).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            </p>
                                            <p>
                                            HR Interview
                                            <small>May 27</small>
                                            </p>
                                        </div>
                                    )
                                ))}
                                
                            </div>
                        </div>

                   </div>
                 </div>
                </main>
            </section>
        </>
    );
}

export default DashBoard;
