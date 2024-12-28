import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";
import '../styles/RegisterUser.css';  // Import the CSS for styling

function RegisterUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    
    const registerUser = async () => {
        const auth = getAuth(app);
        const db = getDatabase(app);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, `users/${user.uid}`), {
                name,
                email,
                role: "user", // Default role is "user"
                createdAt: new Date().toISOString(),
            });

            alert("User registered successfully!");
            window.location.href = "/login"; // Redirect to login page
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form className="register-form">
                <div className="input-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="button" onClick={registerUser} className="register-button">
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterUser;
