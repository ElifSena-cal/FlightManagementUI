import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";

function Airline() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function fetchData() {
        console.log("Fetching data"); // Add this line
        fetch('http://localhost:8080/airlines', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Bearer tokeni ekleyin
            }
        })
            .then((response) => response.json())
            .then((fetchedData) => {
                setData(fetchedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('API verisi alınamadı: ', error);
                setLoading(false);
            });
    }
    useEffect(() => {
        fetchData();
    }, []);

    function handleDelete(id) {
        const confirmDelete = window.confirm("Do you want to delete?");
        if (confirmDelete) {
            if (deleteInProgress) {
                return;
            }
            setDeleteInProgress(true);

            const userId = parseInt(id, 10);

            fetch(`http://localhost:8080/airlines/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Bearer tokeni ekleyin
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Read the response as text
                })
                .then((data) => {
                    // Check if the data is empty or contains a specific response
                    if (data === '') {
                        // Handle the case when the response is empty
                        fetchData(); // Update your data
                        setData((prevData) => prevData.filter(item => item.id !== userId));
                    } else {
                        // Handle cases when the server sends a specific response (e.g., JSON success message)
                        const parsedData = JSON.parse(data); // Parse JSON if available
                        if (parsedData.success) {
                            fetchData(); // Update your data
                            setData((prevData) => prevData.filter(item => item.id !== userId));
                            setMessage('Delete was successful.'); // Set a success message or handle as needed
                            setDeleteInProgress(false);
                        } else {
                            // Handle other possible responses or errors
                            setMessage('Error: Delete failed.');
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setDeleteInProgress(false);
                });
            ;
        }
    }


    function handleUpdate(id) {
        // You can navigate to the "Edit" page with the specific id
        navigate(`/airline/Edit/${id}`);
    }
    return (
        <div className='container'>
            <h2 style={{ marginTop: '20px' }}>Airlines</h2>
            <Link to="/airline/create" className='btn btn-success my-3'>Create +</Link>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {message && <p>{message}</p>}
                    <Table data={data} handleDelete={handleDelete} deleteInProgress={deleteInProgress} handleUpdate={handleUpdate} />
                    {data.map((item) => (
                        <div key={item.id}>
                            {/* Additional content */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Airline;
