import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './NavigationBar.css';

function NavigationBar() {

    const navigate = useNavigate();
    
    const [ sideBar, setSideBar ] = useState(false);

    const openSideBar = () => {

        if(sideBar === false) {
            setSideBar(true);
            return;
        }

        setSideBar(false);
    }

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loginError, setLoginError ] = useState("");

    const sendLogin = async (e) => {

        e.preventDefault();

        try {

            if(!email || !password) {
                setLoginError('Please complete the fields to continue');
                return;
            }

            const response = await fetch('http://localhost:3000/api/user/login', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await response.json();

            if(!response.ok) {
                setLoginError(data.message);
                return;
            }

            navigate('/home');

        }catch(err) {
            console.error(err.message);
        }finally {
            console.log('Request has been sent.');
        }
    }

    const openModalMobile = () => {

            if(triggerModal === false) {
                setTriggerModal(true);
                setSideBar(false);
                return;
            }

            setTriggerModal(false);
            
    }

    const [ triggerModal, setTriggerModal ] = useState(false);
    
    const openModal = () => {

        if(triggerModal === false) {
            setTriggerModal(true);
            setOpenRegister(false);
            return;
        }

        setTriggerModal(false);
    }

    const [ openRegister, setOpenRegister ] = useState(false);

    const registerModal = () => {

        if(openRegister === false) {
            setOpenRegister(true);
            setTriggerModal(false);
            return;
        }

        setOpenRegister(false);
    }

   const [ firstName, setFirstName ] = useState("");
   const [ lastName, setLastName ] = useState("");
   const [ registerEmail, setRegisterEmail ] = useState("");
   const [ registerPassword, setRegisterPassword ] = useState("");
   const [ registrationError, setRegistrationError ] = useState("");
   const [ registrationSuccess, setRegistrationSuccess ] = useState("");

   const sendRegistration = async (e) => {

        e.preventDefault();

        setRegistrationError("");
        setRegistrationSuccess("");

        try {

            if(!firstName || !lastName || !registerEmail || !registerPassword) {
                setRegistrationError("Please complete the fields to proceed.");
                return;
            }

            const response = await fetch('http://localhost:3000/api/user/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: registerEmail,
                    password: registerPassword,
                    firstName: firstName,
                    lastName: lastName
                })
            });

            const data = await response.json();

            if(!response.ok) {
                setRegistrationError(data.message);
                return;
            }

            setRegistrationSuccess(data.message);

        }catch(err) {
            console.error(err.message);
            setRegistrationError(err.message);
        }
   }

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
            <button onClick={openModal}>Log In</button>
        </nav>

        {triggerModal && (
            <div className="login-modal-background" onClick={openModal}>
                <div className="login-container" onClick={(e) => e.stopPropagation()}>
                    <div className="login-header-container">
                        <header>JobTrack AI</header>
                        <button onClick={openModal}>X</button>
                    </div>
                    <div className="welcome-container">
                        <h2>Welcome</h2>
                        <p>Log in to keep tracking your applications.</p>
                    </div>
                    <Link className="google-button">
                    <FcGoogle size={24} />
                    Continue with Google
                    </Link>
                    <div className="divider">
                        <div className="line"></div>
                        <span>or</span>
                        <div className="line"></div>
                    </div>
                    <form className="login-form" onSubmit={sendLogin}>
                        <div className="input-container">
                            <label>Email</label>
                            <input
                            type="email"
                            className="input-style"
                            placeholder="user@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <div className="input-container">
                            <label>Password</label>
                            <input
                            type="password"
                            className="input-style"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <p className="login-error">{loginError}</p>
                        <button type="submit">Log in</button>
                    </form>
                    <div className="register-account">
                        <p>Don't have an account?</p>
                        <button onClick={registerModal}>Get Started Free</button>
                    </div>
                </div>
            </div>
        )}

        {openRegister && (
            <div className="register-modal-background" onClick={registerModal}>
                <div className="register-container" onClick={(e) => e.stopPropagation()}>
                    <div className="register-header-container">
                        <header>JobTrack AI</header>
                        <button onClick={registerModal}>X</button>
                    </div>
                    <div className="welcome-container">
                        <h2>Create your account</h2>
                        <p>Start matching your resume to real opportunities</p>
                    </div>
                    <Link className="google-button">
                    <FcGoogle size={24} />
                    Continue with Google
                    </Link>
                    <div className="divider">
                        <div className="line"></div>
                        <span>or</span>
                        <div className="line"></div>
                    </div>
                    <form className="register-form" onSubmit={sendRegistration}>
                        <div className="name-container">
                            <div className="user-name">
                                <label>First name</label>
                                <input
                                type="text"
                                placeholder='Example Adolf'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="user-name">
                                <label>Last name</label>
                                <input
                                type="text"
                                placeholder='Example Hitler'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Email</label>
                            <input
                            type="email"
                            className="input-style"
                            placeholder="user@gmail.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                            />
                        </div>
                        
                        <div className="input-container">
                            <label>Password</label>
                            <input
                            type="password"
                            className="input-style"
                            placeholder="Enter your password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            minLength={8}
                            />
                        </div>
                        <p className={registrationError ? "registration-error" : "registration-success"}>
                            {registrationError || registrationSuccess}
                        </p>
                        <button type="submit">Register</button>
                    </form>
                    <div className="login-account">
                        <p>Already have an account?</p>
                        <button onClick={openModal}>Log in</button>
                    </div>
                </div>
            </div>
        )}

        <button onClick={openSideBar}  className={`side-bar-burger ${triggerModal || openRegister ? "hide-burger" : ""}`}><span>☰</span></button>

        {sideBar && (
        <>
        <div className="background-side" onClick={openSideBar}>
            <aside onClick={(e) => e.stopPropagation()}>
                <header>JobTrack AI</header>
                <ul>
                    <li><span>❯</span><a>Home</a></li>
                    <li><span>❯</span><a>Features</a></li>
                    <li><span>❯</span><a>How It Works</a></li>
                    <li><span>❯</span><a>About</a></li>
                </ul>
                <button onClick={openModalMobile}>Log In</button>
            </aside>
        </div>
        </>
        )}

        
        
        </>
    );
}

export default NavigationBar;