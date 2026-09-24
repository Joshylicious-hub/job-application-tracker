import './Footer.css'

function Footer() {

    return (
        <>
            <footer>
                <header>
                    <h1>JobTrack AI</h1>
                    <p>Smarter job search. Brighter futures</p>
                </header>
                <ul>
                    <h2>Quick Links</h2>
                    <li><a>Home</a></li>
                    <li><a>Features</a></li>
                    <li><a>How it Works</a></li>
                    <li><a>About</a></li>
                </ul>
                <ul>
                    <h2>Resources</h2>
                    <li><a>Help Center</a></li>
                    <li><a>Blog</a></li>
                    <li><a>Privacy Policy</a></li>
                    <li><a>Terms of Service</a></li>
                </ul>

                <div className="social-medias">
                    <h2>Follow us</h2>
                    <p>@2026 JobTrack AI. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer;