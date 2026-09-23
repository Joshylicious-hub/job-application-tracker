import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {

    return (
        <>

        <nav className="main-nav">
            <h1>JobTrack <span>AI</span></h1>
            <ul>
                <li><a>Features</a></li>
                <li><a>How it Works</a></li>
                <li><a>Benefits</a></li>
                <li><a>FAQ</a></li>
            </ul>
            <Link className="button-log" to="/login">Log in</Link>
        </nav>
        
        </>
    );
}

export default NavigationBar;