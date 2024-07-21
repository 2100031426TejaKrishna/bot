import React, { useEffect, useState } from 'react';
import './questions.css';
import axios from 'axios'; // Import Axios for making HTTP requests

// Switch URLs between Server and Local hosting here
const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

const TitleTab = ({ triggerRefresh }) => {
    const [titles, setTitles] = useState([]);
    const [titleToDelete, setTitleToDelete] = useState('');
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [error, setError] = useState(null);
    // Define state variables to hold the updated data
    const [editedTitle, setEditedTitle] = useState('');
    const [editedSubTitle, setEditedSubTitle] = useState('');
    const [editedNestedTitle, setEditedNestedTitle] = useState('');
    const [editedSubNestedTitle, setEditedSubNestedTitle] = useState('');
    const [titleId, setTitleId] = useState('');
    const [showAddSubtitleModal, setShowAddSubtitleModal] = useState(false);
    const [newSubtitle, setNewSubtitle] = useState('');
    const [showAddNestedtitleModal, setShowAddNestedtitleModal] = useState(false);
    const [newNestedtitle, setNewNestedtitle] = useState('');
    const [showAddSubNestedtitleModal, setShowAddSubNestedtitleModal] = useState(false);
    const [newSubNestedtitle, setNewSubNestedtitle] = useState('');
    const [selectedSubtitleId, setSelectedSubtitleId] = useState('');
    const [selectedNestedtitleId, setSelectedNestedtitleId] = useState('');

    // State variables for toast message
    const [showEditSuccessToast, setShowEditSuccessToast] = useState(false);
    const [showAddSubtitleToast, setShowAddSubtitleToast] = useState(false);
    const [showAddNestedtitleToast, setShowAddNestedtitleToast] = useState(false);
    const [showAddSubNestedtitleToast, setShowAddSubNestedtitleToast] = useState(false);


    const handleAddNestedtitle = (titleId, subtitleId) => {
        setTitleId(titleId);
        setSelectedSubtitleId(subtitleId); // Set the selected subtitle _id
        setShowAddNestedtitleModal(true);
    };
    const handleAddSubNestedTitle = (titleId, subtitleId, nestedTitleId) => {
        setTitleId(titleId);
        setSelectedSubtitleId(subtitleId); // Set the selected subtitle _id
        setSelectedNestedtitleId(nestedTitleId); // Set the selected nested title _id
        setShowAddSubNestedtitleModal(true);
    };

    

    const handleCloseAddNestedtitleModal = () => {
        setShowAddNestedtitleModal(false);
        setNewNestedtitle('');
        setSelectedSubtitleId(''); // Clear the selected subtitle _id
    };
    const handleCloseAddSubNestedTitleModal = () => {
    setShowAddSubNestedtitleModal(false);
    setNewSubNestedtitle('');
    setSelectedSubtitleId(''); // Clear the selected subtitle _id
    setSelectedNestedtitleId(''); // Clear the selected nested title _id
};

  
    const handleSaveNestedtitle = () => {
        // Assuming the subtitle needs to be sent in an object with a key 'subtitle'
        const nestedtitleData = {
            nestedTitle: newNestedtitle
        };
        //for server -https and change to http  for local machine

        axios.post(`https://${destination}/api/insertNestedtitle/${titleId}/${selectedSubtitleId}`, nestedtitleData)
            .then(response => {
                console.log('New nestedtitle added:', response.data);
                setShowAddNestedtitleModal(false); // Close the modal after saving
                setShowAddNestedtitleToast(true);
                setTimeout(() => setShowAddNestedtitleToast(false), 5000);
                triggerRefresh();
            })
            .catch(error => {
                console.error('Error adding nestedtitle:', error);
            });
    };
    const handleSaveSubNestedTitle = () => {
        // Assuming the subNestedTitle needs to be sent in an object with a key 'subNestedTitle'
        const subNestedTitleData = {
            subNestedTitle: newSubNestedtitle
        };
    //for server -https and change to http  for local machine

        axios.post(`https://${destination}/api/insertSubNestedTitle/${titleId}/${selectedSubtitleId}/${selectedNestedtitleId}`, subNestedTitleData)
            .then(response => {
                console.log('New subNestedTitle added:', response.data);
                setShowAddSubNestedtitleModal(false); // Close the modal after saving
                setShowAddSubNestedtitleToast(true);
                setTimeout(() => setShowAddSubNestedtitleToast(false), 5000);
                triggerRefresh();
            })
            .catch(error => {
                console.error('Error adding subNestedTitle:', error);
            });
    };
    

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
       //for server -https and change to http  for local machine

        axios.post(`https://${destination}/api/insertSubtitle/${titleId}`, subtitleData)
            .then(response => {
                console.log('New subtitle added:', response.data);
                setShowAddSubtitleModal(false); // Close the modal after saving
                setShowAddSubtitleToast(true);
                setTimeout(() => setShowAddSubtitleToast(false), 5000);
                triggerRefresh();
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
    const handleSubNestedTitleChange = (event) => {
        setEditedSubNestedTitle(event.target.value);
    };
    const handleDeleteNestedTitle = (titleId, subTitleId) => {
        // Implement deletion logic here, e.g., using axios.delete
        //for server -https and change to http  for local machine

        axios.delete(`https://${destination}/api/deleteSubtitle/${titleId}/${subTitleId}`)
            .then(response => {
                console.log('Subtitle deleted:', response.data);
                // Optionally, update state or trigger a refresh
                triggerRefresh();
            })
            .catch(error => {
                console.error('Error deleting subtitle:', error);
            });
    };
    const handleDeleteSubNestedTitle = (titleId, subTitleId, nestedTitleId, subNestedTitleId) => {
    // Implement deletion logic here, e.g., using axios.delete
    //for server -https and change to http  for local machine

    axios.delete(`https://${destination}/api/deleteSubNestedtitle/${titleId}/${subTitleId}/${nestedTitleId}/${subNestedTitleId}`)
        .then(response => {
            console.log('Sub-Nestedtitle deleted:', response.data);
            // Optionally, update state or trigger a refresh
            triggerRefresh();
        })
        .catch(error => {
            console.error('Error deleting sub-nestedtitle:', error);
        });
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
                                nestedTitleLabel: editedNestedTitle,
                                subNestedTitle: [
                                    {
                                        subNestedTitleLabel: editedSubNestedTitle
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };


        // Send the updatedData object to the backend API using Axios or your preferred method
        //for server -https and change to http  for local machine

        axios.put(`https://${destination}/api/updateTitle/${titleId}`, updatedData)
            .then(response => {
                // Handle success
                console.log('Title updated:', response.data);
                setShowEditSuccessToast(true); // Show the success toast
                setTimeout(() => setShowEditSuccessToast(false), 5000); // Hide the toast after 5 seconds
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
                //for server -https and change to http  for local machine

                const response = await axios.delete(`https://${destination}/api/deleteTitle/${titleToDelete}`);
                if (response.status === 200) {
                    setTitles(titles.filter(title => title._id !== titleToDelete));
                    setTitleToDelete('');
                    setShowDeleteToast(true);
                    setTimeout(() => setShowDeleteToast(false), 5000);
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
                //for server -https and change to http  for local machine

                const response = await axios.get(`https://${destination}/api/displayTitles`); // Assuming the endpoint is available at /api/displayAllTitles
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
            {/* Update title toast notification */}
            {showEditSuccessToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Title updated successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowEditSuccessToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Toast notification */}
            {showDeleteToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-dark text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Title deleted successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowDeleteToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* AddSubtitle Toast notification */}
            {showAddSubtitleToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Subtitle added successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowAddSubtitleToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* AddNestedtitle Toast notification */}
            {showAddNestedtitleToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Nestedtitle added successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowAddNestedtitleToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
             {/* AddSubNestedtitle Toast notification */}
             {showAddSubNestedtitleToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                SubNestedtitle added successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowAddSubNestedtitleToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* Render titles within the component */}
            {titles.map((title, index) => (
                <div key={index} className="question-card">
                    <h4>Title: {title?.title?.titleLabel?.toString() ?? 'No title'}</h4>

                    {/* Render subtitles */}
                    {title?.title?.subTitle?.map((subTitle, subIndex) => (
                        <div key={subIndex}>
                            <h6>Subtitle: {subTitle?.subTitleLabel?.toString() ?? 'No subtitle'}</h6>

                            {/* Check if nestedTitle exists */}
                            {subTitle?.nestedTitle?.map((nestedTitle, nestedIndex) => (
                                <div key={nestedIndex}>
                                    <p>NestedTitle: {nestedTitle?.nestedTitleLabel?.toString() ?? 'No nested title'}</p>
                                    {/* Check if subNestedTitle exists */}
                        {nestedTitle?.subNestedTitle?.map((subNestedTitle, subNestedIndex) => (
                            <div key={subNestedIndex}>
                                <p>SubNestedTitle: {subNestedTitle?.subNestedTitleLabel?.toString() ?? 'No sub-nested title'}</p>
                            </div>
                        ))}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Buttons and modal */}
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
                        <button className="btn btn-secondary" onClick={() => handleAddNestedtitle(title._id)}>Add Nested Title</button>


                        {/* Modal for adding new nestedtitle */}
                        <div className={`modal ${showAddNestedtitleModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showAddNestedtitleModal ? 'block' : 'none' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Nestedtitle</h5>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            {/* Dropdown menu to select subtitle */}
                                            <label htmlFor="subtitleDropdown">Select Subtitle:</label>
                                            <select className="form-control" id="subtitleDropdown" value={selectedSubtitleId} onChange={(e) => setSelectedSubtitleId(e.target.value)}>
                                                {titles.map((title, index) => (
                                                    title.title.subTitle.map(subTitle => ( // No need for subIndex
                                                        <option key={subTitle._id} value={subTitle._id}>{subTitle.subTitleLabel}</option> // Use _id as value
                                                    ))
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nestedtitleInput">Nestedtitle:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nestedtitleInput"
                                                value={newNestedtitle}
                                                onChange={(e) => setNewNestedtitle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseAddNestedtitleModal}>Close</button>
                                        <button type="button" className="btn btn-primary" onClick={handleSaveNestedtitle}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                       {/* Add button to add new sub-nested title */}
<button className="btn btn-secondary" onClick={() => handleAddSubNestedTitle(title._id)}>Add Sub-Nested Title</button>

{/* Modal for adding new sub-nested title */}
<div className={`modal ${showAddSubNestedtitleModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showAddSubNestedtitleModal ? 'block' : 'none' }}>
    <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add New Sub-Nested Title</h5>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    {/* Dropdown menu to select subtitle and nested title */}
                    <label htmlFor="nestedtitleDropdown">Select Nested Title:</label>
                    <select className="form-control" id="nestedtitleDropdown" value={selectedNestedtitleId} onChange={(e) => setSelectedNestedtitleId(e.target.value)}>
                        {titles.map((title,index) => (
                            title.title.subTitle.map(subTitle => (
                                subTitle.nestedTitle.map(nestedTitle => (
                                    <option key={nestedTitle._id} value={nestedTitle._id}>{nestedTitle.nestedTitleLabel}</option>
                                ))
                            ))
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subNestedtitleInput">Sub-Nested Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subNestedtitleInput"
                        value={newSubNestedtitle}
                        onChange={(e) => setNewSubNestedtitle(e.target.value)}
                    />
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAddSubNestedTitleModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveSubNestedTitle}>Save</button>
            </div>
        </div>
    </div>
</div>


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
                    <div id={`defaultTitle${index}`}><em>{title?.title?.titleLabel ?? 'No title'}</em></div>
                </div>

                {/* Form fields for editing title */}
                <form>
                    <div className="mb-3">
                        <label htmlFor={`titleInput${index}`} className="form-label"><strong>Edit Title:</strong></label>
                        <input type="text" className="form-control" id={`titleInput${index}`} value={editedTitle} onChange={handleTitleChange} />
                    </div>
                </form>

                {/* Display default subtitles and form fields for editing */}
                {title?.title?.subTitle?.map((subTitle, subIndex) => (
                    <div key={subIndex}>
                        <div className="mb-3">
                            <label htmlFor={`defaultSubTitle${index}_${subIndex}`} className="form-label"><strong>Default SubTitle:</strong></label>
                            <div id={`defaultSubTitle${index}_${subIndex}`}><em>{subTitle?.subTitleLabel ?? 'No subtitle'}</em></div>
                        </div>
                        {Array.isArray(subTitle?.nestedTitle) && subTitle?.nestedTitle.length > 1 && (
                            <button
                                className="btn btn-outline-secondary delete-button"
                                type="button"
                                onClick={() => handleDeleteNestedTitle(title._id, subTitle._id)}
                            >
                                Delete Subtitle
                            </button>
                        )}

                        {/* Form fields for editing subtitle */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor={`subtitleInput${index}_${subIndex}`} className="form-label"><strong>Edit SubTitle:</strong></label>
                                <input type="text" className="form-control" id={`subtitleInput${index}_${subIndex}`} value={editedSubTitle} onChange={handleSubTitleChange} />
                            </div>
                        </form>

                        {/* Display default nested titles and form fields for editing */}
                        {subTitle?.nestedTitle?.map((nestedTitle, nestedIndex) => (
                            <div key={nestedIndex}>
                                <div className="mb-3">
                                    <label htmlFor={`defaultNestedTitle${index}_${subIndex}_${nestedIndex}`} className="form-label"><strong>Default NestedTitle:</strong></label>
                                    <div id={`defaultNestedTitle${index}_${subIndex}_${nestedIndex}`}><em>{nestedTitle?.nestedTitleLabel ?? 'No nested title'}</em></div>
                                </div>
                                {Array.isArray(nestedTitle?.subNestedTitle) && nestedTitle?.subNestedTitle.length > 1 && (
                                    <button
                                        className="btn btn-outline-secondary delete-button"
                                        type="button"
                                        onClick={() => handleDeleteSubNestedTitle(title._id, subTitle._id, nestedTitle._id)}
                                    >
                                        Delete Sub-Nestedtitle
                                    </button>
                                )}

                                {/* Form fields for editing nested title */}
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`} className="form-label"><strong>Edit NestedTitle:</strong></label>
                                        <input type="text" className="form-control" id={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`} value={editedNestedTitle} onChange={handleNestedTitleChange} />
                                    </div>
                                </form>

                                {/* Display default subNested titles and form fields for editing */}
                                {nestedTitle?.subNestedTitle?.map((subNestedTitle, subNestedIndex) => (
                                    <div key={subNestedIndex}>
                                        <div className="mb-3">
                                            <label htmlFor={`defaultSubNestedTitle${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`} className="form-label"><strong>Default Sub-NestedTitle:</strong></label>
                                            <div id={`defaultSubNestedTitle${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`}><em>{subNestedTitle?.subNestedTitleLabel ?? 'No sub-nested title'}</em></div>
                                        </div>
                                        {Array.isArray(nestedTitle?.subNestedTitle) && nestedTitle?.subNestedTitle.length > 1 && (
                                            <button
                                                className="btn btn-outline-secondary delete-button"
                                                type="button"
                                                onClick={() => handleDeleteSubNestedTitle(title._id, subTitle._id, nestedTitle._id, subNestedTitle._id)}
                                            >
                                                Delete Sub-Nestedtitle
                                            </button>
                                        )}

                                        {/* Form fields for editing sub-nested title */}
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor={`subNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`} className="form-label"><strong>Edit Sub-NestedTitle:</strong></label>
                                                <input type="text" className="form-control" id={`subNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`} value={editedSubNestedTitle} onChange={handleSubNestedTitleChange} />
                                            </div>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Modal footer with buttons */}
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