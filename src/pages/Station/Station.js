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
        console.log("Fetching data"); // Add this line
        fetch('http://localhost:8080/stations', {
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

            fetch(`http://localhost:8080/stations/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Bearer tokeni ekleyin
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Yanıtı metin olarak okuyun
                })
                .then((data) => {
                    // Verinin boş olup olmadığını veya özel bir yanıt içerip içermediğini kontrol edin
                    if (data === '') {
                        // Yanıtın boş olduğu durumu işleyin
                        fetchData(); // Verilerinizi güncelleyin
                        setData((prevData) => prevData.filter(item => item.id !== userId));
                    } else {
                        // Sunucunun belirli bir yanıt gönderdiği durumları işleyin (örneğin, JSON başarı mesajı)
                        const parsedData = JSON.parse(data); // Mevcutsa JSON'ı işleyin
                        if (parsedData.success) {
                            fetchData(); // Verilerinizi güncelleyin
                            setData((prevData) => prevData.filter(item => item.id !== userId));
                            setMessage('Silme başarılı.'); // Başarı mesajını ayarlayın veya gerektiği şekilde işleyin
                            setDeleteInProgress(false);
                        } else {
                            // Diğer olası yanıtları veya hataları işleyin
                            setMessage('Hata: Silme başarısız.');
                        }
                    }
                })
                .catch((error) => {
                    console.error('Hata:', error);
                })
                .finally(() => {
                    setDeleteInProgress(false);
                });
            ;
        }
    }




    function handleUpdate(id) {
        // You can navigate to the "Edit" page with the specific id
        navigate(`/station/Edit/${id}`);
    }
    return (
        <div className='container'>
            <h2 style={{ marginTop: '20px' }}>Stations</h2>
            <Link to="/station/create" className='btn btn-success my-3'>Create +</Link>
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

export default User;
