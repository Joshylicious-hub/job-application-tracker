import { Link } from 'react-router-dom';
import  banner  from '../assets/banner.jpg';
import  dashboard  from '../assets/dashboard.png';
import  steps  from '../assets/steps.png';
import  application  from '../assets/application.png';
import picture from '../assets/joshuagrad.jpg';
import './MainPage.css'

function MainPage() {

    return (
        <>
                <section className="content">
                    <div className="content-container">
                        <h6>AI-Powered Career Assistant</h6>
                        <div className="banner-title">
                            <h1>Find the Right Jobs</h1>
                            <h1>Track Your Progress</h1>
                            <h1 className="banner-title-gradient">Grow Your Career</h1>
                        </div>
                        <div className="banner-description">
                            <p>JobTrack AI analyzes your resume, matches your skills with the</p>
                            <p>best job opportunities, and kept track of your applications -</p>
                            <p>all in one place. Less searching. more doing.</p>
                        </div>
                        <div className="links-button">
                            <Link className="get-started-free">Get Started Free</Link>
                            <Link className="learn-more-button">Learn More</Link>
                        </div>
                        <div className="ai-features">
                            <p>AI Job Matching</p>
                            <p>Application Tracker</p>
                            <p>Personalized Recommendations</p>
                        </div>
                    </div>
                    <div className="dashboard-img-container">
                        <img src={dashboard} className="dashboard-img"/>
                    </div>
                </section>

                <section className="features-container">
                    <div className="features-container-left">
                        <div className="features-description">
                           
                            <div className="features-h1">
                                 <h6 className="features-header">Features</h6>
                                <h1>Everything You Need</h1>
                                <h1>In One Platform</h1>
                            </div>
                            <div className="features-des">
                                <p>Smarter job search. Better opportunities.</p>
                                <p>Powered by AI.</p>
                            </div>
                        </div>
                    </div>

                    <div className="platform-features">
                        <div>
                            <div></div>
                            <div className="ai-headers">
                                <h2>AI-Powered Job Recommendations</h2>
                                <p>Get personalized job suggestions based on your skills, experience,
                                    and preferences
                                </p>
                            </div>
                        </div>
                        <div>
                            <div></div>
                            <div className="ai-headers">
                                <h2>Automated Application Tracking</h2>
                                <p>Keep track of every application, status, and next steps - all in one simple dashboard
                                </p>
                            </div>
                        </div>
                        <div>
                            <div></div>
                            <div className="ai-headers">
                                <h2>Resume Analysis & Skill Matching</h2>
                                <p>Let AI analyze your resume and match you with the right roles that fit your profile.
                                </p>
                            </div>
                        </div>
                        <div>
                            <div></div>
                            <div className="ai-headers">
                                <h2>Access to Top Job Platforms</h2>
                                <p>Search across major job boards like JobStreet, Indeed, and Linkedin all in one place
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="steps-container">
                    <div className="steps-simple-container">
                        <div className="steps-headers">
                            <h6>HOW IT WORKS</h6>
                            <h1>Get Hired in 4 Simple Steps</h1>
                        </div>
                        <div className="simple-steps-container">
                            <div>
                                <div className="simple-container">
                                    <span>1</span>
                                    <div className="simple-headers">
                                        <h2>Upload Your Resume</h2>
                                        <p>Add your latest resume and basic information</p>
                                    </div>
                                </div>
                                 <div className="simple-container">
                                    <span>2</span>
                                    <div className="simple-headers">
                                        <h2>Let AI Do the Work</h2>
                                        <p>We analyze your skills and experience<br/> then find the best matches for you</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                 <div className="simple-container">
                                    <span>3</span>
                                    <div className="simple-headers">
                                        <h2>Track Your Applications</h2>
                                        <p>See real-time updates and manage your progress</p>
                                    </div>
                                </div>
                                 <div className="simple-container">
                                    <span>4</span>
                                    <div className="simple-headers">
                                        <h2>Apply & Get Hired</h2>
                                        <p>Focus on what matters - we'll help you<br/> find the right opportunities</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img src={steps} className="steps-img"/>
                    </div>
                </section>

                <section className="job-container">
                        <div>
                            <img src={application} className="application-img"/>
                        </div>
                        <div className="application-container">
                            <div className="application-description">
                                <h6>WHY CHOOSE JOBTRACK AI</h6>
                                <h1>More than Just a Job Search</h1>
                            </div>
                            <p className="combine">We combine the power of AI with a simple, intuitive design to help you stay organized , save time, and get closer to your dream job.</p>
                            <div className="facts">
                                <div className="facts-container">
                                    <p className="check-container">✓</p>
                                    <p>Save time with automated tracking</p>
                                </div>
                                <div className="facts-container">
                                    <p className="check-container">✓</p>
                                    <p>Get personalized job recommendations</p>
                                </div>
                                <div className="facts-container">
                                    <p className="check-container">✓</p>
                                    <p>Stay organized with a clean, easy-to-use dashboard</p>
                                </div>
                                <div className="facts-container">
                                    <p className="check-container">✓</p>
                                    <p>Access top job platforms in one place</p>
                                </div>
                            </div>
                            
                        </div>
                </section>

                <section className="testimonial-container">
                    <div className="testimonial-headers">
                        <h6><center>REAL PEOPLE, REAL RESULTS</center></h6>
                        <h1>What Our Users Say</h1>
                    </div>
                    <div className="review-container">
                        <div className="review-1">
                            <p>"JobTrack AI made my job search so much easier, I got personalized recommendations and was able to track all my applications in one place. It really helped me land my current role!"</p>
                            <div className="review-picture-container">
                                <div>
                                    <img src={picture} className="review-img"/>
                                </div>
                                <div className="testimonial-user">
                                    <h2>Joshua Andres</h2>
                                    <p>BSIT Graduate | Web Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="review-2">
                            <p>"JobTrack AI made my job search so much easier, I got personalized recommendations and was able to track all my applications in one place. It really helped me land my current role!"</p>
                            <div className="review-picture-container">
                                <div>
                                    <img src={picture} className="review-img"/>
                                </div>
                                <div className="testimonial-user">
                                    <h2>Joshua Andres</h2>
                                    <p>BSIT Graduate | Web Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="review-3">
                            <p>"JobTrack AI made my job search so much easier, I got personalized recommendations and was able to track all my applications in one place. It really helped me land my current role!"</p>
                            <div className="review-picture-container">
                                <div>
                                    <img src={picture} className="review-img"/>
                                </div>
                                <div className="testimonial-user">
                                    <h2>Joshua Andres</h2>
                                    <p>BSIT Graduate | Web Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="get-started">
                        <div className="take-step">
                            <h2>Ready to Take the Next Step?</h2>
                            <p>Join JobTrack AI today and let your dream job find you.</p>
                        </div>
                        <div>
                        <Link className="started-free">Get Started Free</Link>
                        </div>
                    </div>
                </section>
        </>
    )
}

export default MainPage;