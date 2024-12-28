import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase';
import '../styles/LoginPage.css'; // Import the CSS for styling

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async () => {
        const auth = getAuth(app);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            window.location.href = "/"; // Redirect to Support Page
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form">
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
                <button type="button" onClick={loginUser} className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
