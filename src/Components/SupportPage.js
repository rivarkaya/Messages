import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";
import '../styles/SupportFile.css'; // Importing the CSS for styling

function SupportPage() {
    const [userName, setUserName] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("Defected Product");
    const [messages, setMessages] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const auth = getAuth(app);

    // UseEffect to check if the user is logged in
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
            setUserName(currentUser.displayName || "");
            fetchMessages(currentUser.uid); // Fetch user-specific messages
        } else {
            setIsLoggedIn(false);
            fetchMessages("guest"); // Fetch guest-specific messages
        }
    }, [auth.currentUser]);

    // Save data to Firebase
    const saveData = async () => {
        if (!userName || !message) {
            alert("Please fill in both name and message fields.");
            return;
        }

        const db = getDatabase(app);
        const newDocRef = push(ref(db, "messages"));
        const timestamp = new Date().toLocaleString();

        try {
            await set(newDocRef, {
                userId: isLoggedIn ? user.uid : "guest", // Guest or logged-in user
                userName,
                subject,
                message,
                timestamp,
            });
            alert("Message saved!");
            setMessage(""); // Clear the message input field after saving
            fetchMessages(isLoggedIn ? user.uid : "guest"); // Fetch only this user's messages after submission
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // Fetch messages from Firebase and filter by userId
    const fetchMessages = async (userId) => {
        const db = getDatabase(app);
        const messagesRef = ref(db, "messages");
        try {
            const snapshot = await get(messagesRef);
            const data = snapshot.val();
            const messageList = [];

            for (const id in data) {
                if (data[id].userId === userId) { // Filter by logged-in user's UID or guest
                    messageList.push(data[id]);
                }
            }

            setMessages(messageList);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Logout functionality
    const logout = async () => {
        await signOut(auth);
        setIsLoggedIn(false);
        setUser(null);
        setMessages([]);
        window.location.href = "/"; // Redirect to Support Page after logout
    };

    return (
        <div className="support-page-container">
            <h2 className="title">Support Page</h2>
            <div className="auth-buttons">
                {!isLoggedIn ? (
                    <div>
                        <button className="auth-button" onClick={() => window.location.href = "/login"}>Login</button>
                        <button className="auth-button" onClick={() => window.location.href = "/register"}>Register</button>
                    </div>
                ) : (
                    <div>
                        <button className="auth-button logout-button" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>

            <div className="input-container">
                <label className="input-label">Name:</label>
                <input
                    className="input-field"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                />
            </div>
            <div className="input-container">
                <label className="input-label">Subject:</label>
                <select
                    className="input-field"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="Defected Product">Defected Product</option>
                    <option value="Late Order">Late Order</option>
                    <option value="Lost Product">Lost Product</option>
                    <option value="Suggestion">Suggestion</option>
                </select>
            </div>
            <div className="input-container">
                <label className="input-label">Message:</label>
                <textarea
                    className="input-field"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
            </div>
            <button className="submit-button" onClick={saveData}>Submit</button>

            <div className="messages-container">
                <h3>Your Messages</h3>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className="message-card">
                            <strong>{msg.userName}</strong> ({msg.subject})<br />
                            <p>{msg.message}</p>
                            {msg.response && (
                                <div className="response-card">
                                    <strong>Admin Response:</strong> <p>{msg.response}</p>
                                </div>
                            )}
                            <em>{msg.timestamp}</em>
                        </div>
                    ))
                ) : (
                    <p>No messages yet</p>
                )}
            </div>
        </div>
    );
}

export default SupportPage;
