import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';
import axios from 'axios'; // Import Axios for making HTTP requests

// Switch URLs between Server and Local hosting here
const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

const TitleTab = ({ triggerRefresh }) => {
    const [titles, setTitles] = useState([]);
    const [titleToDelete, setTitleToDelete] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState(null);


    const deleteTitle = async () => {
        if (titleToDelete) {
            console.log('Title to delete:', titleToDelete); // Log titleToDelete variable
            try {
                const response = await axios.delete(`http://${destination}/api/deleteTitle/${titleToDelete}`);
                if (response.status === 200) {
                    setTitles(titles.filter(title => title._id !== titleToDelete));
                    setTitleToDelete('');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 5000);
                    // Trigger refresh after deleting the title
                    triggerRefresh();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error deleting title:", error);
            }
        }
    };



    // Fetch titles when component mounts
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await axios.get(`http://${destination}/api/displayTitles`); // Assuming the endpoint is available at /api/displayAllTitles
                setTitles(response.data); // Set titles from the response
                console.log(response.data); // Log the titles data to the console
            } catch (error) {
                console.error('Error fetching titles:', error);
            }
        };

        fetchTitles(); // Call the fetchTitles function
    }, []); // Empty dependency array ensures this effect runs only once when component mounts

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!titles.length) {
        return <div>No titles available</div>;
    }

    return (
        <div className="questions-container">
            {/* Toast notification */}
            {showToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-dark text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Title deleted successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* Render titles within the component */}
            {titles.map((title, index) => (
                <div key={index} className="question-card">
                    <h4>Title: {title.title.titleLabel.toString()}</h4>
    
                    {/* Render subtitles */}
                    {title.title.subTitle.map((subTitle, subIndex) => (
                        <div key={subIndex}>
                            <h6>Subtitle: {subTitle.subTitleLabel.toString()}</h6>
    
                            {/* Check if nestedTitle exists */}
                            {subTitle.nestedTitle && subTitle.nestedTitle.map((nestedTitle, nestedIndex) => (
                                <div key={nestedIndex}>
                                    <p>NestedTitle: {nestedTitle.nestedTitleLabel.toString()}</p>
                                </div>
                            ))}
                        </div>
                    ))}
    
                    {/* Delete button and modal for confirming deletion */}
                    <div className="question-actions">
                        <button
                            className="btn btn-danger"
                            data-bs-toggle={`modal`}
                            data-bs-target={`#exampleModal${index}`} // Use unique modal ID for each title
                            onClick={() => {
                                setTitleToDelete(title._id); // Pass the title ID to delete
                                deleteTitle(); // Call deleteTitle function
                            }}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="modal fade" id={`exampleModal${index}`} tabIndex="-1" aria-labelledby={`exampleModalLabel${index}`} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id={`exampleModalLabel${index}`}>Confirm Deletion</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to delete this title?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                        onClick={deleteTitle} // Add onClick handler to trigger the delete action
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
    
            
        </div>
    );
};    

export default TitleTab;
