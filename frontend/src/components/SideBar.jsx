import './SideBar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function SideBar() {

    const [ openDashboard, setOpenDashboard ] = useState(false);

    const openDashboardSideBar = () => {

        if(openDashboard === false) {
            setOpenDashboard(true);
            return;
        }

        setOpenDashboard(false);
    }

    return (
        <>
          <aside className="side-bar">
            <h1>JobTrack <span>AI</span></h1>
            <ul>
                <li><Link to='/home'>Dashboard</Link></li>
                <li><Link to='/chatbot'>AI Assistant</Link></li>
                <li><Link>Applications</Link></li>
            </ul>
            <div className="user-log">
                <p>Joshua Andres</p>
                <p>joshua@gmail.com</p>
            </div>
        </aside>  

        <button className="side-bar-burger" onClick={openDashboardSideBar}><span>☰</span></button>

        {openDashboard && (
            <div className="background-dashboard-side">
                <aside className="side-bar-dashboard">
                <h1>JobTrack <span>AI</span></h1>
                <ul>
                    <li><Link to='/home'>Dashboard</Link></li>
                    <li><Link to='/chatbot'>AI Assistant</Link></li>
                    <li><Link>Applications</Link></li>
                </ul>
                <div className="user-log">
                    <p>Joshua Andres</p>
                    <p>joshua@gmail.com</p>
                </div>
            </aside>
        </div>  
        )}
        </>
    )
}

export default SideBar;