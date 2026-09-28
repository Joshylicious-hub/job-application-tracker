import './ApplicationPage.css';
import SideBar from '../components/SideBar';
import { useState, useRef, useEffect } from 'react';

function ApplicationPage() {

    const [ application, setApplication ] = useState([]);

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

    return (
        <>
        <section className="dashboard-application">
            <SideBar/>

            <main className="application-main">

            <div className="application-container">
                <div className="applications-contain-dashboard">

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

                                {[...application].reverse().map((data) => (
                                    <div className="application-row" key={data.id}>
                                        <p>{data.company}</p>

                                        <p>{data.position}</p>

                                        <p>
                                            <span className={`status-${data.status.toLowerCase()}`}>
                                                {data.status}
                                            </span>
                                        </p>

                                        <p>
                                            {new Date(data.date).toLocaleDateString('en-US', {
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
                                ))}
                                
                            </div>
                        </div>
                 </div>
            </main>
        </section>
            
        
        </>
    );
}

export default ApplicationPage;