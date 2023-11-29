import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        const credentials = {
            userName: userName,
            password: password
        };

        const handleResponse = (response) => {
            if (response.ok) {
                response.json().then(data => {
                    const { accessToken, role, userName } = data;

                    console.log('Giriş başarılı.');
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('userName', userName);
                    window.location.href = '/';
                });
            } else {
                alert("Login failed!")
            }
        };

        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
            .then(handleResponse)
            .catch(error => {
                console.error('İstek hatası:', error);
            });
    };


    const handleRegister = () => {
        navigate('/register'); // navigate to the register page
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <input
                        type="text"
                        name="userName"
                        required
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Login;