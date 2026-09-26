import './DashBoard.css'
import joshuagrad from '../assets/joshuagrad.jpg'
import SideBar from './SideBar'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashBoard() {

const [ userData, setUserData ] = useState({});
const [ application, setApplication ] = useState([]);


const total = application.length;
const pending = application.filter((data) => data.status === "Pending").length;
const interview = application.filter((data) => data.status === "Interview").length;
const offered = application.filter((data) => data.status === "Offered").length;
const rejected = application.filter((data) => data.status === "Rejected").length;

const pendingPercent = total ? (pending / total) * 100 : 0;
const interviewPercent = total ? (interview / total) * 100 : 0;
const offeredPercent = total ? (offered / total) * 100 : 0;
const rejectedPercent = total ? (rejected / total) * 100 : 0;

const pendingEnd = pendingPercent;
const interviewEnd = pendingEnd + interviewPercent;
const offeredEnd = interviewEnd + offeredPercent;
const rejectedEnd = offeredEnd + rejectedPercent;

useEffect(() => {

    async function getUserName() {

        try {

            const response = await fetch('http://localhost:3000/api/user/name', {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json();

            if(!response.ok) {
                console.error(data.message);
                return;
            }

            setUserData(data);


        }catch(err) {
            console.log(err.message);
        }

    }

    getUserName();
}, [])


async function getApplications() {
    
    try {

        const response = await fetch('http://localhost:3000/api/user/application', {
            credentials: "include"
        });

        const data = await response.json();

        if(!response.ok) {
            console.log(data.message);
            return;
        }

        setApplication(data);

    }catch(err) {
        console.error(err.message);
    }
}

useEffect(() => {
     getApplications();
})
   


const capitalize = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const [ applicationModal, setApplicationModal ] = useState(false);

const openApplication = () => {

    if(applicationModal === false) {
        setApplicationModal(true);
        return;
    }

    setApplicationModal(false);

}

const [ company, setCompany ] = useState("");
const [ position, setPosition ] = useState("");
const [ status, setStatus ] = useState("Pending");
const [ dateApplied, setDateApplied ] = useState("");
const [ step, setStep ] = useState("Not Available");
const [ applicationSucess, setApplicationSuccess ] = useState("");
const [ applicationError, setApplicationError ] = useState("");

const sendApplication = async (e) => {

    e.preventDefault();

    try {

        if(!company || !position || !status || !dateApplied || !step) {
            setApplicationError("Please complete the fields to continue");
            return;
        }

        setCompany("")
        setPosition("");
        setStatus("Pending");
        setDateApplied("");
        setStep("Not Available");

        const response = await fetch('http://localhost:3000/api/user/insertApplication', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                company: company,
                position: position,
                status: status,
                dateApplied: dateApplied,
                step: step
            })
        })

        const data = await response.json();
        

        if(!response.ok) {
            setApplicationError(data.message);
            return;
        }

        setApplicationSuccess(data.message);
        getApplications();

    }catch(err) {
        setApplicationError(err.message);
    }
}

    return (
        <>
            <section className=" dashboard">
                <SideBar/>

                <main className="main-content border">
                   <div className="border profile">
                    <div className="border">
                        <h2>Welcome, {capitalize(userData.firstName)} {capitalize(userData.lastName)}</h2>
                        <p>Here's what happening with your job search today.</p>
                    </div>
                    <div className="profile-container">
                        <button onClick={openApplication}>+ Add Application</button>
                        <img src={joshuagrad} className="picture"/>
                    </div>
                   </div>

                   {applicationModal && (

                    <div className="application-background" onClick={openApplication}>
                        <div className="application-container-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="application-container">
                                <div className="application-header-container">
                                    <h2>New Application</h2>
                                    <p>Add the details of your job application</p>
                                </div>
                                <div>
                                    <button className="exit-application" onClick={openApplication}>X</button>
                                </div>
                            </div>

                             <form onSubmit={sendApplication}>
                                <fieldset>
                                    <legend>Company</legend>
                                    <input
                                    type="text"
                                    placeholder='Accenture'
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Position</legend>
                                    <input
                                    type="text"
                                    placeholder="Software Engineer"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Status</legend>
                                    <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offered">Offered</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </fieldset>

                                <fieldset>
                                    <legend>Date Applied</legend>
                                    <input
                                    type="date"
                                    value={dateApplied}
                                    onChange={(e) => setDateApplied(e.target.value)}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Next Step</legend>
                                    <select
                                    value={step}
                                    onChange={(e) => setStep(e.target.value)}
                                    >
                                        <option value="Not Available">Not Available</option>
                                        <option value="HR Interview">HR Intervew</option>
                                        <option value="Technical Interview">Technical Interview</option>
                                        <option value="Final Interview">Final Interview</option>
                                    </select>
                                </fieldset>

                                <p className={applicationError ? "application-error" : "application-success"}>
                                    {applicationError || applicationSucess}
                                </p>

                                <div className="application-buttons">
                                    <button className="application-cancel">Cancel</button>
                                    <button type="submit" className="application-save">Save Application</button>
                                </div>
                            </form>

                        </div>
                    </div>
                   )}

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
                                {application.filter((data) => data.status === "Pending").length}
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
                            <h3>{application.filter((data) => data.status === "Interview").length}</h3>
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
                            <h3>{application.filter((data) => data.status === "Offered").length}</h3>
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
                            <h3>{application.filter((data) => data.status === "Rejected").length}</h3>
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
                            <p>Interview Schedule</p>
                            <p>View Details</p>
                        </div>

                        <div className="statistics">
                            <div className="interview-company">
                                <h3>ABC Technologies</h3>
                                <p>Software Developer</p>
                            </div>

                            <div className="interview-details">
                                <div>
                                    <p>Date</p>
                                    <p>May 27, 2026</p>
                                </div>

                                <div>
                                    <p>Time</p>
                                    <p>10:00 AM - 11:00 AM</p>
                                </div>

                                <div>
                                    <p>Location</p>
                                    <p>Google Meet</p>
                                </div>
                            </div>

                            <div className="interview-status">
                                <p>Interview with HR Department</p>
                                <span>Upcoming</span>
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

                                {application.slice(-5).reverse().map((data, index) => (
                                    index < 5 && (
                                         <div className="application-row" key={data.id}>
                                            <p>{data.company}</p>
                                            <p>{data.position}</p>
                                            <p>
                                            <span className={`status-${data.status.toLowerCase()}`}>
                                                {data.status}
                                            </span>
                                            </p>
                                            <p> {new Date(data.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            </p>
                                            <p>
                                            {data.step}
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
