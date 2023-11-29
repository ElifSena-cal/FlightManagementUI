import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Aircraft from './pages/Aircraft/Aircraft';
import Station from './pages/Station/Station';
import User from './pages/User/User';
import Airline from './pages/Airline/Airline';
import Flight from './pages/Flight/Flight';
import Create from './components/Crud/Create';
import Update from './components/Crud/Update';
import { useEffect, useState } from "react";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function Home() {
    return <div>Ana Sayfa</div>;
}


function App() {
    const [stationOptions, setStationOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aircraftOptions, setFirstApiData] = useState([]);
    const [airlineOptions, setSecondApiData] = useState([]);
    const token = localStorage.getItem('accessToken')

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) { // Eğer accessToken varsa istekleri yap
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const requestOptions = {
                method: 'GET',
                headers: headers
            };

            fetch('http://localhost:8080/stations/stations-dropdown', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const transformedOptions = data.map(station => ({ value: station.id, label: station.code }));
                    setStationOptions(transformedOptions);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('API request error:', error);
                    setLoading(false);
                });

            fetch('http://localhost:8080/aircrafts/aircrafts-dropdown', requestOptions)
                .then((response) => response.json())
                .then((data2) => {
                    console.log(data2);
                    const transformedOptions = data2.map(aircraft => ({ value: aircraft.id, label: aircraft.code }));
                    setFirstApiData(transformedOptions);
                })
                .catch((error) => {
                    console.error('First API request error:', error);
                });

            fetch('http://localhost:8080/airlines/airlines-dropdown', requestOptions)
                .then((response) => response.json())
                .then((data2) => {
                    console.log(data2);
                    const transformedOptions = data2.map(aircraft => ({ value: aircraft.id, label: aircraft.code }));
                    setSecondApiData(transformedOptions);
                })
                .catch((error) => {
                    console.error('First API request error:', error);
                });
        }
    }, []);



    return (
        <Router>
            {token ? <Navbar /> : null}
            <Routes>
                <Route path="/register" element={<Register />} />
                {token ? (
                    <>
                        <Route path="/" element={<Flight />} />
                        <Route path="/aircraft" element={<Aircraft />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/station" element={<Station />} />
                        <Route path="/airline" element={<Airline />} />
                        <Route path="/flight" element={<Flight />} />

                        {!loading && (
                            <Route
                                path="/flight/create"
                                element={
                                    <Create
                                        endpoint="flights"
                                        title="Create Flight"
                                        backPath="Flight"
                                        fields={[

                                            {
                                                name: 'airlineId',
                                                label: 'Airline',
                                                type: 'select',
                                                options: airlineOptions.map(option => ({
                                                    value: option.value,
                                                    label: option.label,
                                                })),
                                                required: true,
                                            },
                                            { name: 'flightNo', label: 'Flight No', required: true, type: 'text' },
                                            {
                                                name: 'flightLeg',
                                                label: 'Flight Leg',
                                                required: true,
                                                type: 'select',
                                                options: [
                                                    { value: 'Arr', label: 'Arrival' },
                                                    { value: 'Dep', label: 'Departure' }
                                                ]
                                            },

                                            { name: 'flightDate', label: 'Flight Date and Time', required: true, type: 'datetime-local' },
                                            {
                                                name: 'aircraftId',
                                                label: 'Aircraft',
                                                type: 'select',
                                                options: aircraftOptions.map(option => ({
                                                    value: option.value,
                                                    label: option.label,
                                                })),
                                                required: true,
                                            },

                                            {
                                                name: 'systemAirportId',
                                                label: 'System Station',
                                                type: 'select',
                                                options: stationOptions.map(option => ({
                                                    value: option.value,
                                                    label: option.label,
                                                })),
                                                required: true,
                                            },
                                            {
                                                name: 'originStationId',
                                                label: 'Origin Station',
                                                type: 'select',
                                                options: stationOptions.map(option => ({
                                                    value: option.value,
                                                    label: option.label,
                                                })),
                                                required: true,
                                            },
                                        ]}
                                        errorMessage="Flight with the same details already exists"
                                    />
                                }
                            />
                        )}

                        <Route
                            path="/station/create"
                            element={
                                <Create
                                    endpoint="stations"
                                    title="Create Station"
                                    backPath="Station"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required: false, type: 'text' },
                                    ]}
                                    errorMessage="Station with the same code already exists"
                                />
                            }
                        />

                        <Route
                            path="/airline/create"
                            element={
                                <Create
                                    endpoint="airlines"
                                    title="Create Airline"
                                    backPath="Airline"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required: false, type: 'text' },
                                    ]}
                                    errorMessage="Airline with the same code already exists"
                                />
                            }
                        />
                        <Route
                            path="/aircraft/create"
                            element={
                                <Create
                                    endpoint="aircrafts"
                                    title="Create Aircraft"
                                    backPath="Aircraft"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required: false, type: 'text' },
                                    ]}
                                    errorMessage="Aircraft with the same code already exists"
                                />
                            }
                        />

                        <Route
                            path="/user/create"
                            element={
                                <Create
                                    endpoint="users"
                                    title="Create User"
                                    backPath="User"
                                    fields={[
                                        { name: 'userName', label: 'Username', required: true, type: 'text' },
                                        { name: 'name', label: 'Name', required: false, type: 'text' },
                                        { name: 'surname', label: 'Surname', required: false, type: 'text' },
                                        { name: 'password', label: 'Password', required: true, type: 'password' },
                                        {
                                            name: 'role',
                                            label: 'Role',
                                            required: true,
                                            type: 'select',
                                            options: [
                                                { value: 'ADMIN', label: 'ADMIN' },
                                                { value: 'USER', label: 'USER' }
                                            ]
                                        },
                                    ]}
                                    errorMessage="User with the same userName already exists"
                                />
                            }
                        />

                        <Route
                            path="/user/edit/:id"
                            element={
                                <Update
                                    endpoint="users"
                                    title="Edit User"
                                    backPath="User"
                                    fields={[
                                        { name: 'userName', label: 'Username', required: true, type: 'text' },
                                        { name: 'name', label: 'Name', required: false, type: 'text' },
                                        { name: 'surname', label: 'Surname', required: false, type: 'text' },

                                        {
                                            name: 'role',
                                            label: 'Role',
                                            required: true,
                                            type: 'select',
                                            options: [
                                                { value: 'ADMIN', label: 'ADMIN' },
                                                { value: 'USER', label: 'USER' }
                                            ]
                                        },
                                    ]}
                                    errorMessage="User with the same userName already exists"
                                />
                            }
                        />

                        <Route
                            path="/aircraft/edit/:id"
                            element={
                                <Update
                                    endpoint="aircrafts"
                                    title="Edit Aircraft"
                                    backPath="Aircraft"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required:false, type: 'text' },
                                    ]}
                                    errorMessage="Aircraft with the same code already exists"
                                />
                            }
                        />

                        <Route
                            path="/station/edit/:id"
                            element={
                                <Update
                                    endpoint="stations"
                                    title="Edit Station"
                                    backPath="Station"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required: false, type: 'text' },
                                    ]}
                                    errorMessage="Station with the same code already exists"
                                />
                            }
                        />

                        <Route
                            path="/airline/edit/:id"
                            element={
                                <Update
                                    endpoint="airlines"
                                    title="Edit Airline"
                                    backPath="Airline"
                                    fields={[
                                        { name: 'code', label: 'Code', required: true, type: 'text' },
                                        { name: 'description', label: 'Description', required: false, type: 'text' },
                                    ]}
                                    errorMessage="Airline with the same code already exists"
                                />
                            }
                        />

                        <Route
                            path="/flight/edit/:id"
                            element={
                                <Update
                                    endpoint="flights"
                                    title="Update Flight"
                                    backPath="Flight"
                                    fields={[

                                        {
                                            name: 'airlineId',
                                            label: 'Airline',
                                            type: 'select',
                                            options: airlineOptions.map(option => ({
                                                value: option.value,
                                                label: option.label,
                                            })),
                                            required: true,
                                        },
                                        { name: 'flightNo', label: 'Flight No', required: true, type: 'text' },
                                        {
                                            name: 'flightLeg',
                                            label: 'Flight Leg',
                                            required: true,
                                            type: 'select',
                                            options: [
                                                { value: 'Arr', label: 'Arrival' },
                                                { value: 'Dep', label: 'Departure' }
                                            ]
                                        },

                                        { name: 'flightDate', label: 'Flight Date and Time', required: true, type: 'datetime-local' },
                                        {
                                            name: 'aircraftId',
                                            label: 'Aircraft',
                                            type: 'select',
                                            options: aircraftOptions.map(option => ({
                                                value: option.value,
                                                label: option.label,
                                            })),
                                            required: true,
                                        },

                                        {
                                            name: 'systemAirportId',
                                            label: 'System Station',
                                            type: 'select',
                                            options: stationOptions.map(option => ({
                                                value: option.value,
                                                label: option.label,
                                            })),
                                            required: true,
                                        },
                                        {
                                            name: 'originStationId',
                                            label: 'Origin Station',
                                            type: 'select',
                                            options: stationOptions.map(option => ({
                                                value: option.value,
                                                label: option.label,
                                            })),
                                            required: true,
                                        },
                                    ]}
                                    errorMessage="Flight with the same details already exists"
                                />
                            }
                        />
                    </>
                ) : (
                    <Route path="/" element={<Login />} />

                )}
            </Routes>

        </Router>
    );
}

export default App;

