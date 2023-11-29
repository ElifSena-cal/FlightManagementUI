import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
function Update({ endpoint, title, backPath, fields, errorMessage }) {
    const [inputData, setInputData] = useState({});
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:8080/${endpoint}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then((response) => {

                if (response.ok) {
                    return response.json();
                }
                if (response.status === 404) {
                    throw new Error("Not Found");
                }
                else {
                    throw new Error("Failed to fetch data");
                }
            })
            .then((data) => {
                setInputData(data);

                fields.forEach((field) => {
                    if (data[field.name]) {
                        setInputData((prevData) => ({
                            ...prevData,
                            [field.name]: data[field.name],
                        }));
                    }
                });

            })
            .catch((error) => {
                setError('Error fetching data: ' + error);
            });
    }, [id, endpoint]);


    const handleSubmit = (event) => {
        event.preventDefault();

        const hasErrors = validateFields();
        if (hasErrors) {
            return;
        }
        const userName = localStorage.getItem('userName');
        const updatedInputData = {
            ...inputData,
            updateUser: userName,
            id:id
        };
        fetch(`http://localhost:8080/${endpoint}/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedInputData),
        })
            .then((response) => {
                if (response.ok) {
                    toastr.success("Success", "Success");

                } else {
                    if (response.status === 409) {
                        
                        setError(errorMessage || "Conflict occurred while updating");
                    } else {
                        setError("An error occurred while updating the data");
                    }
                }
            })
            .catch((error) => {
                setError('Error updating data: ' + error);
            });
    };

    const validateFields = () => {
        const fieldErrors = {};
        let hasErrors = false;

        fields.forEach((field) => {
            if (field.required && !inputData[field.name]) {
                fieldErrors[field.name] = `${field.label} is required.`;
                hasErrors = true;
            }
        });

        setErrors(fieldErrors);
        return hasErrors;
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{title}</span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate(`/${backPath}`)}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                {fields.map((field) => (
                                    <div className="form-group" key={field.name}>
                                        <label htmlFor={field.name}>{field.label}:</label>
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                className="form-control"
                                                value={inputData[field.name] || ''}
                                                onChange={(e) =>
                                                    setInputData({
                                                        ...inputData,
                                                        [field.name]: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">Choose</option>
                                                {field.options.map((option) => (

                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                className="form-control"
                                                value={inputData[field.name] || ''}
                                                onChange={(e) =>
                                                    setInputData({
                                                        ...inputData,
                                                        [field.name]: e.target.value,
                                                    })
                                                }
                                                required={field.required}
                                            />
                                        )}
                                        {errors[field.name] && (
                                            <div className="text-danger">
                                                {errors[field.name]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button type="submit" className="btn btn-primary">
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Update;
