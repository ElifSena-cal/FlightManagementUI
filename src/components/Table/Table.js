import React from 'react';


function formatDate(date) {
    // Önce date'i bir dizeye dönüştür
    const dateString = date.toString();

    if (dateString.includes('T')) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(date).toLocaleString(undefined, options);
    } else {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');
        const timeFormat = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${year}/${month}/${day}, ${formattedHours}:${minutes}:${seconds} ${timeFormat}`;
    }
}



// ...
function Table({ data, handleDelete, deleteInProgress, handleUpdate }) {
    const userRole = localStorage.getItem('userRole');
    return (
        <div className="table-responsive">
            <table className='table'>
                <thead>
                <tr>
                    {data.length > 0 &&
                        Object.keys(data[0]).map((header) => <th key={header}>{header}</th>)}
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {data.map((d, i) => (
                    <tr key={i}>
                        {Object.keys(d).map((key, j) => (
                            <td key={j}>
                                {(key === 'createTime' || key === 'updateTime') ? formatDate(new Date(d[key])) : d[key]}
                            </td>
                        ))}
                        <td>
                            <button
                                className='text-decoration-none btn btn-sm btn-success'
                                onClick={() => handleUpdate(d.id)}
                            >
                                Update
                            </button>
                            {userRole === 'ADMIN' && (
                                <button
                                    className='text-decoration-none btn btn-sm btn-danger'
                                    onClick={() => handleDelete(d.id)}
                                    disabled={deleteInProgress}
                                >
                                    Delete
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}



export default Table;
