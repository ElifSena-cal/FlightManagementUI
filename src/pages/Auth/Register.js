import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [userName, setUserName] = useState('');
    const [name, setName] = useState(''); // Name state eklenmiş
    const [surname, setSurname] = useState(''); // Surname state eklenmiş
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);


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
            setError( "User with the same username already exists");
        }
    };
    const handleRegister = (event) => {
        try {
            event.preventDefault();

            const registrationData = {
                userName: userName,
                name: name,
                surname: surname,
                password: password,
                role: "USER"
            };

            // Kayıt işlemi API isteği burada yapılır
            fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            })
                .then(handleResponse)
                .catch(error => {
                    throw new Error('İstek hatası: ' + error);
                });
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h2>Register</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form>
                                <div className="form-group">
                                    <label htmlFor="userName">Username:</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        required
                                        className="form-control"
                                        placeholder="Username"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="form-control"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="surname">Surname:</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        required
                                        className="form-control"
                                        placeholder="Surname"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button onClick={handleRegister} className="btn btn-primary">Register</button>
                                </div>
                                <div className="form-group">
                                    <button onClick={() => navigate('/')} className="btn btn-secondary">Go to Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
