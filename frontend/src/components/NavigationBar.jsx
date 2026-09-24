import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {

    return (
        <>

        <nav>
            <header>JobTrack AI</header>
            <ul>
                <li><a>Home</a></li>
                <li><a>Features</a></li>
                <li><a>How It Works</a></li>
                <li><a>About</a></li>
            </ul>
            <button>Log In</button>
        </nav>
        
        </>
    );
}

export default NavigationBar;