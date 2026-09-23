import './SideBar.css';
import { Link } from 'react-router-dom';

function SideBar() {

    return (
        <>
          <nav className="side-bar">
            <h1>JobTrack <span>AI</span></h1>
            <ul>
                <li><Link to='/home'>Dashboard</Link></li>
                <li><Link to='/chatbot'>AI Assistant</Link></li>
                <li><Link>Applications</Link></li>
                <li><Link>Calendar</Link></li>
                <li><Link>Documents</Link></li>
                <li><Link>Statistics</Link></li>
                <li><Link>Settings</Link></li>
            </ul>
            <div className="user-log">
                <p>Joshua Andres</p>
                <p>joshua@gmail.com</p>
            </div>
        </nav>  
        </>
    )
}

export default SideBar;