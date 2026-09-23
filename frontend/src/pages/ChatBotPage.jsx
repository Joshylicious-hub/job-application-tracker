import { useState, useRef, useEffect } from 'react';
import SideBar from '../components/SideBar';
import ReactMarkdown from 'react-markdown';

import './ChatBotPage.css';

function ChatBotPage() {

    const [message, setMessage] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [chatbot, setChatBot] = useState([])

    const sendChatBot = async () => {

        try {
            setLoading(true);
            setChatBot((previous) => [
                ...previous,
                {
                    role: "user",
                    message: message
                }
            ])

            setMessage("");

            const response = await fetch('http://localhost:3000/api/user/openai', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat: message
             })
          })

          

          const data = await response.json();

          if(!response.ok) {
            console.error(data.message);
            return;
          }

          setChatBot((previous) => [
            ...previous,
            {
                role: "bot",
                message: data.message
            }
          ])

        }catch(err) {
            console.error(err);
        }finally{
            console.log("message sent");
            setLoading(false);
        }
    }

const chatEndRef = useRef(null);

useEffect(() => {
chatEndRef.current?.scrollIntoView({
    behavior: "smooth"
});
}, [chatbot, loading]);

    return (

    <main className="chatbot-container">
        <SideBar />

        <section className="chatbot-contain">
            <div className="chatbot-title">
                <div className="title-left">
                    <span className="sparkle">✦</span>
                    <div>
                        <div className="title-name">
                            <p>AI Assistant</p>
                            <span>BETA</span>
                        </div>
                        <p className="title-description">
                            Your AI job search copilot
                        </p>
                    </div>
                </div>
                <div className="title-buttons">
                    <button>↗</button>
                    <button>◷</button>
                    <button>×</button>
                </div>
            </div>


            <div className="chatbot-header">
                <div className="chatbot">
                    <div className="chat">
                        <div className="welcome">
                            <div className="bot-icon">
                                🤖
                            </div>
                            <div className="welcome-text">
                                <h3>Hi Joshua!</h3>
                                <p>
                                    I'm your AI job search assistant. I can help you:
                                </p>
                                <div className="help">
                                    <div>
                                        <span>✓</span>
                                        <p>Optimize your resume and cover letter</p>
                                    </div>
                                    <div>
                                        <span>✓</span>
                                        <p>Find jobs that match your skills</p>
                                    </div>
                                    <div>
                                        <span>✓</span>
                                        <p>Prepare for interviews</p>
                                    </div>
                                    <div>
                                        <span>✓</span>
                                        <p>Track your application progress</p>
                                    </div>
                                    <div>
                                        <span>✓</span>
                                        <p>And much more!</p>
                                    </div>
                                </div>
                                <h4>
                                    What would you like help with today?
                                </h4>
                            </div>
                        </div>

                    

                    {chatbot.map((data, index) => (
                        data.role === "user" ? (
                        <div className="user-chat" key={index}>
                            <div className="user-message">
                                <p>{data.message}</p>
                                <span>
                                    10:30 AM ✓✓
                                </span>
                            </div>
                            <div className="user-icon">
                                JA
                            </div>
                        </div>
                        ) : (
                        <div className="bot-chat" key={index}>
                            <div className="bot-icon small">
                                🤖
                            </div>
                            <div className="bot-message">
                              <ReactMarkdown>
                                {data.message}
                              </ReactMarkdown>
                            </div>
                        </div>
                        )
                    ))}

                    {loading && (
                        <div className="bot-chat">
                            <div className="bot-icon small">
                                🤖
                            </div>

                            <div className="bot-message">
                                <p>Typing...</p>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef}></div>
                       
                    </div>


                    <div className="input">
                        <div className="input-box">
                            <button className="attach">⌕</button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask me anything about your job search..."
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") {
                                        sendChatBot();
                                    }
                                }}
                            />
                            <button className="send" onClick={sendChatBot} disabled={loading}>➤</button>
                        </div>

                        <p>
                        ✦ AI can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>


                <div className="quick-action">
                    <div className="quick-action-container">
                        <h3>
                            Quick Actions
                        </h3>
                        <button className="action">
                            <div className="action-icon purple">
                                ▣
                            </div>
                            <div>
                                <strong>
                                    Optimize my resume
                                </strong>
                                <p>
                                    Improve your resume for ATS
                                </p>
                            </div>
                            <span>›</span>
                        </button>


                        <button className="action">
                            <div className="action-icon blue">
                                ▤
                            </div>
                            <div>
                                <strong>
                                    Generate a cover letter
                                </strong>
                                <p>
                                    Create a custom cover letter
                                </p>
                            </div>
                            <span>›</span>
                        </button>


                        <button className="action">
                            <div className="action-icon green">
                                ⌕
                            </div>
                            <div>
                                <strong>
                                    Find jobs for me
                                </strong>
                                <p>
                                    Match jobs to your profile
                                </p>
                            </div>
                            <span>›</span>
                        </button>


                        <button className="action">
                            <div className="action-icon pink">
                                ♟
                            </div>
                            <div>
                                <strong>
                                    Prepare for interview
                                </strong>
                                <p>
                                    Practice common questions
                                </p>
                            </div>
                            <span>›</span>
                        </button>

                    </div>


                    <div className="insights">
                        <h3>
                            ✦ AI Insights
                        </h3>
                        <div className="insight">
                            <div className="score">
                                <div>
                                    <strong>68%</strong>
                                    <span>Good</span>
                                </div>
                            </div>

                            <div className="insight-text">
                                <strong>
                                    You're on the right track!
                                </strong>
                                <p>
                                    Keep applying and optimizing to increase your chances.
                                </p>
                                <button>
                                    View details →
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="matches">
                        <h3>
                            Suggested for you
                        </h3>
                        <div className="match">
                            <p>
                                Frontend Developer
                            </p>
                            <strong>
                                92% Match
                            </strong>
                        </div>


                        <div className="match">
                            <p>
                                React Developer
                            </p>
                            <strong>
                                88% Match
                            </strong>
                        </div>


                        <div className="match">
                            <p>
                                UI/UX Designer
                            </p>
                            <strong>
                                75% Match
                            </strong>
                        </div>
                        <button>
                            View all matches →
                        </button>
                    </div>
                </div>
            </div>

        </section>

    </main>
    );
}

export default ChatBotPage;