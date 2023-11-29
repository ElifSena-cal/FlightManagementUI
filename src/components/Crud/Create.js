import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create({ endpoint, title, backPath, fields, errorMessage }) {
    const initialInputData = {};
    fields.forEach((field) => {
        initialInputData[field.name] = '';
    });
   
    const [inputData, setInputData] = useState(initialInputData);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const hasErrors = validateFields();
        if (hasErrors) {
            return;
        }

        const token = localStorage.getItem('accessToken');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(inputData),
        };

        console.log(inputData);

        fetch(`http://localhost:8080/${endpoint}/create`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate(`/${backPath}`);
                } else {
                    if (response.status === 409) {
                        setError(errorMessage || "User with the same username already exists");
                    } else {
                        setError("An error occurred while posting the data");
                    }
                }
            })
            .catch((error) => {
                setError('Error posting data: ' + error);
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
                                        {field.type === 'select' && field.options ? (
                                            <select
                                                name={field.name}
                                                className="form-control"
                                                value={inputData[field.name]}
                                                onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    if (selectedValue === 'Choose') {
                                                        alert(`${field.label} must be selected.`);
                                                    } else {
                                                        const updatedData = {
                                                            ...inputData,
                                                            [field.name]: selectedValue,
                                                        };
                                                        setInputData(updatedData);
                                                    }
                                                }}
                                            >
                                                <option value="Choose">---Choose---</option>
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
                                                value={inputData[field.name]}
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
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;
