import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";

function User() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function fetchData() {
        console.log("Fetching data");
        fetch('http://localhost:8080/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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

            fetch(`http://localhost:8080/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Bearer tokeni ekleyin
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Yanıtı metin olarak okuyun
                })
                .then((data) => {

                    if (data === '') {

                        fetchData();
                        setData((prevData) => prevData.filter(item => item.id !== userId));
                    } else {
                        // Sunucunun belirli bir yanıtı (ör. JSON başarı mesajı) gönderdiği durumları işleyin
                        const parsedData = JSON.parse(data); // Kullanılabilirse JSON'ı ayrıştırın
                        if (parsedData.success) {
                            fetchData(); // Verinizi güncelleyin
                            setData((prevData) => prevData.filter(item => item.id !== userId));
                            setMessage('Delete was successful.'); // Başarı mesajını ayarlayın veya gerektiği gibi işleyin
                        } else {

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
        }
    }



    function handleUpdate(id) {
        navigate(`/User/Edit/${id}`);
    }
    return (
        <div className='container'>
            <h2 style={{ marginTop: '20px' }}>Users</h2>
            <Link to="/User/create" className='btn btn-success my-3'>Create +</Link>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {message && <p>{message}</p>}
                    <Table data={data} handleDelete={handleDelete} deleteInProgress={deleteInProgress} handleUpdate={handleUpdate} />
                    {data.map((item) => (
                        <div key={item.id}>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default User;
