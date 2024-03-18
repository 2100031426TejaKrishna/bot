import React, { useEffect, useState } from 'react';
import './questions.css';
import axios from 'axios'; // Import Axios for making HTTP requests

// Switch URLs between Server and Local hosting here
const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

const TitleTab = ({ triggerRefresh }) => {
    const [titles, setTitles] = useState([]);
    const [titleToDelete, setTitleToDelete] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState(null);
    // Define state variables to hold the updated data
    const [editedTitle, setEditedTitle] = useState('');
    const [editedSubTitle, setEditedSubTitle] = useState('');
    const [editedNestedTitle, setEditedNestedTitle] = useState('');
    const [titleId, setTitleId] = useState('');
    const [showAddSubtitleModal, setShowAddSubtitleModal] = useState(false);
    const [newSubtitle, setNewSubtitle] = useState('');
    // State variables for toast message
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    // State variable for controlling modal visibility

    const handleAddSubtitle = (titleId) => {
        setTitleId(titleId);
        setShowAddSubtitleModal(true);
    };

    const handleCloseAddSubtitleModal = () => {
        setShowAddSubtitleModal(false);
        setNewSubtitle('');
    };

    const handleSaveSubtitle = () => {
        // Assuming the subtitle needs to be sent in an object with a key 'subtitle'
        const subtitleData = {
            subtitle: newSubtitle
        };
    
        axios.post(`http://${destination}/api/insertSubtitle/${titleId}`, subtitleData)
            .then(response => {
                console.log('New subtitle added:', response.data);
                setShowAddSubtitleModal(false); // Close the modal after saving
                triggerRefresh(); // Trigger refresh to update the UI
            })
            .catch(error => {
                console.error('Error adding subtitle:', error);
            });
    };

    const handleEditClick = (titleId) => {
        setTitleId(titleId);
    };

    // Event handler to update the editedTitle state when the user types in the input field
    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handleSubTitleChange = (event) => {
        setEditedSubTitle(event.target.value);
    };

    const handleNestedTitleChange = (event) => {
        setEditedNestedTitle(event.target.value);
    };



    // Event handler to handle form submission
    const handleFormSubmit = () => {
        // Create the updatedData object
        const updatedData = {
            title: {
                titleLabel: editedTitle,
                subTitle: [
                    {
                        subTitleLabel: editedSubTitle,
                        nestedTitle: [
                            {
                                nestedTitleLabel: editedNestedTitle
                            }
                        ]
                    }
                ]
            }
        };


        // Send the updatedData object to the backend API using Axios or your preferred method
        axios.put(`http://${destination}/api/updateTitle/${titleId}`, updatedData)
            .then(response => {
                // Handle success
                console.log('Title updated:', response.data);
                setShowSuccessToast(true); // Show the success toast
                setTimeout(() => setShowSuccessToast(false), 5000); // Hide the toast after 5 seconds
            })
            .catch(error => {
                // Handle error
                console.error('Error updating title:', error);
            });
    };


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
                setError(error); // Set the error state
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
            {/* Success toast notification */}
            {showSuccessToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Title updated successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowSuccessToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
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
                        {/* Add button to add new subtitle */}
                        <button className="btn btn-secondary" onClick={() => handleAddSubtitle(title._id)}>Add Subtitle</button>

                        {/* Modal for adding new subtitle */}
                        <div className={`modal ${showAddSubtitleModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showAddSubtitleModal ? 'block' : 'none' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Subtitle</h5>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label htmlFor="subtitleInput">Subtitle:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subtitleInput"
                                                value={newSubtitle}
                                                onChange={(e) => setNewSubtitle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseAddSubtitleModal}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleSaveSubtitle}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add button to add new nested title */}
                        <button className="btn btn-secondary" >Add Nested Title</button>
                        {/* Edit button */}
                        <button
                            className="btn btn-primary"
                            data-bs-toggle={`modal`}
                            data-bs-target={`#editModal${index}`}
                            onClick={() => handleEditClick(title._id)} // Pass titleId to the event handler
                        >
                            Edit
                        </button>

                        {/* Edit Modal */}
                        <div className="modal fade" id={`editModal${index}`} tabIndex="-1" aria-labelledby={`editModalLabel${index}`} aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id={`editModalLabel${index}`}>Edit Title</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Display default title */}
                                        <div className="mb-3">
                                            <label htmlFor={`defaultTitle${index}`} className="form-label"><strong>Default Title:</strong></label>
                                            <div id={`defaultTitle${index}`}><em>{title.title.titleLabel}</em></div>
                                        </div>

                                        {/* Form fields for editing */}
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor={`titleInput${index}`} className="form-label"><strong>Edit Title:</strong></label>
                                                <input type="text" className="form-control" id={`titleInput${index}`} value={editedTitle} onChange={handleTitleChange} />
                                            </div>
                                        </form>

                                        {/* Display default subtitles and form fields for editing */}
                                        {title.title.subTitle.map((subTitle, subIndex) => (
                                            <div key={subIndex}>
                                                <div className="mb-3">
                                                    <label htmlFor={`defaultSubTitle${index}_${subIndex}`} className="form-label"><strong>Default SubTitle:</strong></label>
                                                    <div id={`defaultSubTitle${index}_${subIndex}`}><em>{subTitle.subTitleLabel}</em></div>
                                                </div>
                                                {Array.isArray(title.title.subTitle) && title.title.subTitle.length > 1 && (
                                                    <button
                                                        className="btn btn-outline-secondary delete-button"
                                                        type="button"
                                                    >
                                                        Delete Subtitle
                                                    </button>
                                                )}

                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor={`subtitleInput${index}_${subIndex}`} className="form-label"><strong>Edit SubTitle:</strong></label>
                                                        <input type="text" className="form-control" id={`subtitleInput${index}_${subIndex}`} value={editedSubTitle} onChange={handleSubTitleChange} />
                                                    </div>
                                                </form>

                                                {/* Display default nested titles and form fields for editing */}
                                                {subTitle.nestedTitle && subTitle.nestedTitle.map((nestedTitle, nestedIndex) => (
                                                    <div key={nestedIndex}>
                                                        <div className="mb-3">
                                                            <label htmlFor={`defaultNestedTitle${index}_${subIndex}_${nestedIndex}`} className="form-label"><strong>Default NestedTitle:</strong></label>
                                                            <div id={`defaultNestedTitle${index}_${subIndex}_${nestedIndex}`}><em>{nestedTitle.nestedTitleLabel}</em></div>
                                                        </div>
                                                        {Array.isArray(subTitle.nestedTitle) && subTitle.nestedTitle.length > 1 && (
                                                            <button
                                                                className="btn btn-outline-secondary delete-button"
                                                                type="button"
                                                            >
                                                                Delete Nestedtitle
                                                            </button>
                                                        )}

                                                        <form>
                                                            <div className="mb-3">
                                                                <label htmlFor={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`} className="form-label"><strong>Edit NestedTitle:</strong></label>
                                                                <input type="text" className="form-control" id={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`} value={editedNestedTitle} onChange={handleNestedTitleChange} />
                                                            </div>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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