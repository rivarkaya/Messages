import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import app from "../firebase";
import '../styles/AdminPage.css'; // Import CSS file

function AdminPage() {
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const db = getDatabase(app);
        const messagesRef = ref(db, "messages");

        // Fetch all messages
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const formattedMessages = data ? Object.entries(data).map(([id, msg]) => ({ id, ...msg })) : [];
            setMessages(formattedMessages);
        });
    }, []);

    const handleRespond = async (messageId) => {
        if (!response.trim()) {
            alert("Please enter a response.");
            return;
        }

        const db = getDatabase(app);
        const messageRef = ref(db, `messages/${messageId}/response`);

        try {
            // Update the response in the database
            await set(messageRef, response);
            alert("Response sent successfully.");

            // Update the local state to reflect the change
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, response: response } : msg
                )
            );

            setResponse(""); // Clear the response textarea
            setSelectedMessage(null); // Deselect the message
        } catch (error) {
            alert("Error sending response: " + error.message);
        }
    };

    return (
        <div className="admin-page">
            <h2 className="admin-header">Admin Page</h2>
            <h3 className="message-header">All Messages</h3>
            {messages.length === 0 ? (
                <p className="no-messages">No messages available.</p>
            ) : (
                <ul className="message-list">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className={`message-item ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                            onClick={() => setSelectedMessage(msg)}
                        >
                            <p><strong>User:</strong> {msg.userName || "Guest"}</p>
                            <p><strong>Subject:</strong> {msg.subject || "N/A"}</p>
                            <p><strong>Message:</strong> {msg.message}</p>
                            {msg.response && (
                                <div className="admin-response">
                                    <strong>Response:</strong>
                                    <p>{msg.response}</p>
                                </div>
                            )}
                            <p className="timestamp"><strong>Date:</strong> {new Date(msg.timestamp).toLocaleString()}</p>
                            {/* Respond Button */}
                            <button
                                className="respond-button"
                                onClick={() => setSelectedMessage(msg)} // Select message to respond to
                            >
                                Respond
                            </button>
                            {selectedMessage?.id === msg.id && (
                                <div className="response-section">
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Enter your response here"
                                        rows="4"
                                        className="response-textarea"
                                    ></textarea>
                                    <button
                                        onClick={() => handleRespond(msg.id)}
                                        className="response-button"
                                    >
                                        Send Response
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminPage;
