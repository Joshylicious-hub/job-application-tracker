import { Link } from 'react-router-dom';
import  banner  from '../assets/banner.jpg';
import './MainPage.css'

function MainPage() {

    return (
        <>
            <section className="hero">
                <div className="left-width">
                    <p className="tracking">AI-Powered Job Application Tracking</p>
                    <div className="header-h1">
                        <h1>Track smarter.</h1>
                        <h1>Apply Better.</h1>
                        <h1 className="hired">Get hired.</h1>
                    </div>
                    <div className="description">
                        <p>JobTrack AI helps you organize your applications,</p>
                        <p>get AI insights, and stay ahead in your job search.</p>
                    </div>
                    <Link to="/login">Get Started Free</Link>
                    <p className="loved">Loved by job seekers worldwide</p>
                </div>

                <div className="width ">
                    <img src={banner} className="banner"/>
                </div>
            </section>
        </>
    )
}

export default MainPage;