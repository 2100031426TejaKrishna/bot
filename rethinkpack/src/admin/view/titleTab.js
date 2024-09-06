import React, { useEffect, useState } from 'react';
import './questions.css';
import axios from 'axios'; // Import Axios for making HTTP requests

// Switch URLs between Server and Local hosting here
const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";


const TitleTab = ({ triggerRefresh }) => {
    const [titles, setTitles] = useState([]);
    const [titleToDelete, setTitleToDelete] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [error, setError] = useState(null);

    const [editedTitle, setEditedTitle] = useState('');
    const [editedSubtitles, setEditedSubtitles] = useState({});
    const [editedNestedTitles, setEditedNestedTitles] = useState({});
    const [editedSubNestedTitles, setEditedSubNestedTitles] = useState({});
    const [editedSubSubNestedTitles, setEditedSubSubNestedTitles] = useState({});

    const [titleId, setTitleId] = useState('');
    const [showAddSubtitleModal, setShowAddSubtitleModal] = useState(false);
    const [newSubtitle, setNewSubtitle] = useState('');
    const [showAddNestedtitleModal, setShowAddNestedtitleModal] = useState(false);
    const [newNestedtitle, setNewNestedtitle] = useState('');
    const [showAddSubNestedtitleModal, setShowAddSubNestedtitleModal] = useState(false);
    const [newSubNestedtitle, setNewSubNestedtitle] = useState('');
    const [showAddSubSubNestedtitleModal, setShowAddSubSubNestedtitleModal] = useState(false);
    const [newSubSubNestedtitle, setNewSubSubNestedtitle] = useState('');

    const [selectedSubtitleId, setSelectedSubtitleId] = useState('');
    const [selectedNestedtitleId, setSelectedNestedtitleId] = useState('');
    const [selectedSubNestedtitleId, setSelectedSubNestedtitleId] = useState('');
    const [selectedSubSubNestedtitleId, setSelectedSubSubNestedtitleId] = useState('');

    const [showEditSuccessToast, setShowEditSuccessToast] = useState(false);
    const [showAddSubtitleToast, setShowAddSubtitleToast] = useState(false);
    const [showAddNestedtitleToast, setShowAddNestedtitleToast] = useState(false);
    const [showAddSubNestedtitleToast, setShowAddSubNestedtitleToast] = useState(false);
    const [showAddSubSubNestedtitleToast, setShowAddSubSubNestedtitleToast] = useState(false);

    // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTitles = titles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(titles.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


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

    const handleAddSubSubNestedTitle = (titleId, subtitleId, nestedTitleId,subNestedTitleId) => {
        setTitleId(titleId);
        setSelectedSubtitleId(subtitleId); // Set the selected subtitle _id
        setSelectedNestedtitleId(nestedTitleId); // Set the selected nested title _id
        setSelectedSubNestedtitleId(subNestedTitleId); // Set the selected sub nested title _id
        setShowAddSubSubNestedtitleModal(true);
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
 
    const handleCloseAddSubSubNestedTitleModal = () => {
    setShowAddSubSubNestedtitleModal(false);
    setNewSubSubNestedtitle('');
    setSelectedSubtitleId(''); // Clear the selected subtitle _id
    setSelectedSubNestedtitleId(''); // Clear the selected subtitle _id
    setSelectedNestedtitleId(''); // Clear the selected nested title _id
};

  
    const handleSaveNestedtitle = () => {
        // Assuming the subtitle needs to be sent in an object with a key 'subtitle'
        const nestedtitleData = {
            nestedTitle: newNestedtitle
        };

        axios.post(`http://${destination}/api/insertNestedtitle/${titleId}/${selectedSubtitleId}`, nestedtitleData)
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
         // Log the IDs to check their values
    console.log('titleId:', titleId);
    console.log('selectedSubtitleId:', selectedSubtitleId);
    console.log('selectedNestedtitleId:', selectedNestedtitleId);

    if (!selectedSubtitleId) {
        console.error('selectedSubtitleId is undefined.');
        return; // Exit early if the selectedSubtitleId is not set
    }
    
        axios.post(`http://${destination}/api/insertSubNestedTitle/${titleId}/${selectedSubtitleId}/${selectedNestedtitleId}`, subNestedTitleData)
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

    const handleSaveSubSubNestedTitle = () => {
        // Assuming the subNestedTitle needs to be sent in an object with a key 'subNestedTitle'
        const subSubNestedTitleData = {
            subSubNestedTitle: newSubSubNestedtitle
        };
        if (!selectedSubtitleId || !selectedNestedtitleId || !selectedSubNestedtitleId || !newSubSubNestedtitle) {
            alert("Please fill in all fields");
            return;
          }
    
        axios.post(`http://${destination}/api/insertSubSubNestedTitle/${titleId}/${selectedSubtitleId}/${selectedNestedtitleId}/${selectedSubNestedtitleId}`, subSubNestedTitleData)
            .then(response => {
                console.log('New subSubNestedTitle added:', response.data);
                setShowAddSubSubNestedtitleModal(false); // Close the modal after saving
                setShowAddSubSubNestedtitleToast(true);
                setTimeout(() => setShowAddSubSubNestedtitleToast(false), 5000);
                triggerRefresh();

                
            })
            .catch(error => {
                console.error('Error adding subSubNestedTitle:', error);
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

        axios.post(`http://${destination}/api/insertSubtitle/${titleId}`, subtitleData)
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

    const handleEditClick = (titleId, subtitleId, nestedTitleId, subNestedTitleId, subSubNestedTitleId) => {
        setTitleId(titleId);
        setSelectedSubtitleId(subtitleId || '');
        setSelectedNestedtitleId(nestedTitleId || '');
        setSelectedSubNestedtitleId(subNestedTitleId || '');
        setSelectedSubSubNestedtitleId(subSubNestedTitleId || '');
    };
    

    const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
};

const handleSubTitleChange = (event, titleId, subTitleId) => {
    setEditedSubtitles(prevState => ({
        ...prevState,
        [`${titleId}-${subTitleId}`]: event.target.value,
    }));
};


const handleNestedTitleChange = (event, titleId, subTitleId, nestedTitleId) => {
    setEditedNestedTitles(prevState => ({
        ...prevState,
        [`${titleId}-${subTitleId}-${nestedTitleId}`]: event.target.value,
    }));
};


const handleSubNestedTitleChange = (event, titleId, subTitleId, nestedTitleId, subNestedTitleId) => {
    setEditedSubNestedTitles(prevState => ({
        ...prevState,
        [`${titleId}-${subTitleId}-${nestedTitleId}-${subNestedTitleId}`]: event.target.value,
    }));
};


const handleSubSubNestedTitleChange = (event, titleId, subTitleId, nestedTitleId, subNestedTitleId, subSubNestedTitleId) => {
    setEditedSubSubNestedTitles(prevState => ({
        ...prevState,
        [`${titleId}-${subTitleId}-${nestedTitleId}-${subNestedTitleId}-${subSubNestedTitleId}`]: event.target.value,
    }));
};

const handleDeleteSubTitle = (titleId, subTitleId) => {
    // Implement deletion logic here, using axios.delete
    axios.delete(`http://${destination}/api/deleteSubtitle/${titleId}/${subTitleId}`)
        .then(response => {
            console.log('Subtitle deleted:', response.data);
            // Optionally, update state or trigger a refresh
            triggerRefresh();
        })
        .catch(error => {
            console.error('Error deleting subtitle:', error);
        });
};


    const handleDeleteNestedTitle = (titleId, subTitleId,nestedTitleId) => {
        // Implement deletion logic here, e.g., using axios.delete
        axios.delete(`http://${destination}/api/deleteSubtitle/${titleId}/${subTitleId}/${nestedTitleId}`)
            .then(response => {
                console.log('Nested Title deleted:', response.data);
                // Optionally, update state or trigger a refresh
                triggerRefresh();
            })
            .catch(error => {
                console.error('Error deleting subtitle:', error);
            });
    };
    const handleDeleteSubNestedTitle = (titleId, subTitleId, nestedTitleId, subNestedTitleId) => {
    // Implement deletion logic here, e.g., using axios.delete
    axios.delete(`http://${destination}/api/deleteSubNestedtitle/${titleId}/${subTitleId}/${nestedTitleId}/${subNestedTitleId}`)
        .then(response => {
            console.log('Sub-Nestedtitle deleted:', response.data);
            // Optionally, update state or trigger a refresh
            triggerRefresh();
        })
        .catch(error => {
            console.error('Error deleting sub-nestedtitle:', error);
        });
};
    const handleDeleteSubSubNestedTitle = (titleId, subTitleId, nestedTitleId, subNestedTitleId,subSubNestedTitleId) => {
    // Implement deletion logic here, e.g., using axios.delete
    axios.delete(`http://${destination}/api/deleteSubSubNestedtitle/${titleId}/${subTitleId}/${nestedTitleId}/${subNestedTitleId}/${subSubNestedTitleId}`)
        .then(response => {
            console.log('Sub-Sub Nestedtitle deleted:', response.data);
            // Optionally, update state or trigger a refresh
            triggerRefresh();
        })
        .catch(error => {
            console.error('Error deleting sub-sub nestedtitle:', error);
        });
};

    // Event handler to handle form submission
    const handleFormSubmit = () => {
        const existingTitle = titles.find(title => title._id === titleId);
        const updatedData = {
            title: {
                titleLabel: editedTitle || existingTitle?.title?.titleLabel,
                subTitle: existingTitle?.title?.subTitle.map(subTitle => ({
                    subTitleLabel: editedSubtitles[`${titleId}-${subTitle._id}`] || subTitle.subTitleLabel,
                    nestedTitle: subTitle.nestedTitle.map(nestedTitle => ({
                        nestedTitleLabel: editedNestedTitles[`${titleId}-${subTitle._id}-${nestedTitle._id}`] || nestedTitle.nestedTitleLabel,
                        subNestedTitle: nestedTitle.subNestedTitle.map(subNestedTitle => ({
                            subNestedTitleLabel: editedSubNestedTitles[`${titleId}-${subTitle._id}-${nestedTitle._id}-${subNestedTitle._id}`] || subNestedTitle.subNestedTitleLabel,
                            subSubNestedTitle: subNestedTitle.subSubNestedTitle.map(subSubNestedTitle => ({
                                subSubNestedTitleLabel: editedSubSubNestedTitles[`${titleId}-${subTitle._id}-${nestedTitle._id}-${subNestedTitle._id}-${subSubNestedTitle._id}`] || subSubNestedTitle.subSubNestedTitleLabel
                            }))
                        }))
                    }))
                }))
            }
        };
    
        axios.put(`http://${destination}/api/updateTitle/${titleId}`, updatedData)
            .then(response => {
                console.log('Title updated:', response.data);
                setShowEditSuccessToast(true);
                setTimeout(() => setShowEditSuccessToast(false), 5000);
                triggerRefresh(); // Optionally refresh the data
            })
            .catch(error => {
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
            {/* AddSubSubNestedtitle Toast notification */}
            {showAddSubSubNestedtitleToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                SubSubNestedtitle added successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowAddSubSubNestedtitleToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
            {/* Render paginated titles */}
    {currentTitles.map((title, index) => (
      <div key={index} className="question-card">
        <h4>Title: {title?.title?.titleLabel?.toString() ?? 'No title'}</h4>

        {/* Render subtitles */}
        {title?.title?.subTitle?.map((subTitle, subIndex) => (
          <div key={subIndex}>
            <h6>Subtitle: {subTitle?.subTitleLabel?.toString() ?? 'No subtitle'}</h6>

            {/* Render nested titles */}
            {subTitle?.nestedTitle?.map((nestedTitle, nestedIndex) => (
              <div key={nestedIndex}>
                <p>NestedTitle: {nestedTitle?.nestedTitleLabel?.toString() ?? 'No nested title'}</p>

                {/* Render sub-nested titles */}
                {nestedTitle?.subNestedTitle?.map((subNestedTitle, subNestedIndex) => (
                  <div key={subNestedIndex}>
                    <p>SubNestedTitle: {subNestedTitle?.subNestedTitleLabel?.toString() ?? 'No sub-nested title'}</p>

                    {/* Render sub-sub-nested titles */}
                    {subNestedTitle?.subSubNestedTitle?.map((subSubNestedTitle, subSubNestedIndex) => (
                      <div key={subSubNestedIndex}>
                        <p>SubSubNestedTitle: {subSubNestedTitle?.subSubNestedTitleLabel?.toString() ?? 'No sub-subnested title'}</p>
                      </div>
                    ))}
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
                                        <button type="button" className="btn btn-primary" onClick={() => handleSaveSubtitle()}>Save</button>
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
                                        <button type="button" className="btn btn-primary" onClick={() => handleSaveNestedtitle()}>Save</button>
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
                    <label htmlFor="subtitleDropdown">Select Subtitle:</label>
                    <select className="form-control" id="subtitleDropdown" value={selectedSubtitleId} onChange={(e) => setSelectedSubtitleId(e.target.value)}>
                        {titles.map((title, index) => (
                            title.title.subTitle.map(subTitle => (
                                <option key={subTitle._id} value={subTitle._id}>{subTitle.subTitleLabel}</option>
                            ))
                        ))}
                    </select>
                </div>
                <div className="form-group">
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
                   <button type="button" className="btn btn-primary" onClick={() => handleSaveSubNestedTitle()}>Save</button>
                   </div>
               </div>
                </div>
             </div>

            {/* Add button to add new sub-sub nested title */}
            <button className="btn btn-secondary" onClick={() => handleAddSubSubNestedTitle(title._id)}>Add Sub-Sub Nested Title</button>

            {/* Modal for adding new sub-sub nested title */}
            <div className={`modal ${showAddSubSubNestedtitleModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showAddSubSubNestedtitleModal ? 'block' : 'none' }}>
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Add New Sub-Sub-Nested Title</h5>
      </div>
      <div className="modal-body">
        <div className="form-group">
          {/* Dropdown menu to select subtitle */}
          <label htmlFor="subtitleDropdown">Select Subtitle:</label>
          <select className="form-control" id="subtitleDropdown" value={selectedSubtitleId} onChange={(e) => setSelectedSubtitleId(e.target.value)}>
            {titles.map((title, index) => (
              title.title.subTitle.map(subTitle => (
                <option key={subTitle._id} value={subTitle._id}>{subTitle.subTitleLabel}</option>
              ))
            ))}
          </select>
        </div>
        <div className="form-group">
          {/* Dropdown menu to select nested title */}
          <label htmlFor="nestedtitleDropdown">Select Nested Title:</label>
          <select className="form-control" id="nestedtitleDropdown" value={selectedNestedtitleId} onChange={(e) => setSelectedNestedtitleId(e.target.value)}>
            {titles.map((title, index) => (
              title.title.subTitle.map(subTitle => (
                subTitle.nestedTitle.map(nestedTitle => (
                  <option key={nestedTitle._id} value={nestedTitle._id}>{nestedTitle.nestedTitleLabel}</option>
                ))
              ))
            ))}
          </select>
        </div>
        <div className="form-group">
          {/* Dropdown menu to select sub-nested title */}
          <label htmlFor="subNestedtitleDropdown">Select Sub-Nested Title:</label>
          <select className="form-control" id="subNestedtitleDropdown" value={selectedSubNestedtitleId} onChange={(e) => setSelectedSubNestedtitleId(e.target.value)}>
            {titles.map((title, index) => (
              title.title.subTitle.map(subTitle => (
                subTitle.nestedTitle.map(nestedTitle => (
                  nestedTitle.subNestedTitle.map(subNestedTitle => (
                    <option key={subNestedTitle._id} value={subNestedTitle._id}>{subNestedTitle.subNestedTitleLabel}</option>
                  ))
                ))
              ))
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subSubNestedtitleInput">Sub-Sub-Nested Title:</label>
          <input
                            type="text"
            className="form-control"
                                      id="subSubNestedtitleInput"
                                 value={newSubSubNestedtitle}
                                               onChange={(e) => setNewSubSubNestedtitle(e.target.value)}
                                             />
                                                    </div>
                                                 </div>
                                  <div className="modal-footer">
                                           <button type="button" className="btn btn-secondary" onClick={handleCloseAddSubSubNestedTitleModal}>Close</button>
                                           <button type="button" className="btn btn-primary" onClick={() => handleSaveSubSubNestedTitle()}>Save</button>
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
                                                  onClick={() => handleDeleteSubTitle(title._id, subTitle._id)}
                                                >
                                                  Delete Subtitle
                                                </button>
                                                              )}                    


                                               {/* Form fields for editing subtitle */}
<form>
  <div className="mb-3">
    <label htmlFor={`subtitleInput${index}_${subIndex}`} className="form-label">
      <strong>Edit Subtitle:</strong>
    </label>
    <input
      type="text"
      className="form-control"
      id={`subtitleInput${index}_${subIndex}`}
      value={
        // Access the edited value from state or fallback to the original value
        editedSubtitles[`${title._id}-${subTitle._id}`] || 
        subTitle.subTitleLabel || '' // Fallback to the original value or empty string
      }
      onChange={(e) => handleSubTitleChange(e, title._id, subTitle._id)}
    />
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
                                                               onClick={() => handleDeleteNestedTitle(title._id, subTitle._id, nestedTitle._id)}
                                                            >
                                                             Delete Nestedtitle
                                                             </button>
                                                                       )}


                                                       {/* Form fields for editing nested title */}
<form>
  <div className="mb-3">
    <label htmlFor={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`} className="form-label">
      <strong>Edit NestedTitle:</strong>
    </label>
    <input
      type="text"
      className="form-control"
      id={`nestedTitleInput${index}_${subIndex}_${nestedIndex}`}
      value={
        // Access the edited value from state or fallback to the original value
        editedNestedTitles[`${title._id}-${subTitle._id}-${nestedTitle._id}`] ||
        nestedTitle.nestedTitleLabel || '' // Fallback to the original value or empty string
      }
      onChange={(e) => handleNestedTitleChange(
        e,
        title._id,
        subTitle._id,
        nestedTitle._id
      )}
    />
  </div>
</form>


                                                        {/* Display default subNested titles and form fields for editing */}
                                                        {nestedTitle?.subNestedTitle?.map((subNestedTitle, subNestedIndex) => (
                                                            <div key={subNestedIndex}>
                                                                <div className="mb-3">
                                                                    <label htmlFor={`defaultSubNestedTitle${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`} className="form-label"><strong>Default SubNestedTitle:</strong></label>
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
    <label htmlFor={`subNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`} className="form-label">
      <strong>Edit SubNestedTitle:</strong>
    </label>
    <input
      type="text"
      className="form-control"
      id={`subNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}`}
      value={
        // Access the edited value from state or fallback to the original value
        editedSubNestedTitles[`${title._id}-${subTitle._id}-${nestedTitle._id}-${subNestedTitle._id}`] || 
        subNestedTitle.subNestedTitleLabel || '' // Fallback to the original value or empty string
      }
      onChange={(e) => handleSubNestedTitleChange(
        e,
        title._id,
        subTitle._id,
        nestedTitle._id,
        subNestedTitle._id
      )}
    />
  </div>
</form>


                                                                {/* Display default subSubNested titles and form fields for editing */}
                                                                {subNestedTitle?.subSubNestedTitle?.map((subSubNestedTitle, subSubNestedIndex) => (
                                                                    <div key={subSubNestedIndex}>
                                                                        <div className="mb-3">
                                                                            <label htmlFor={`defaultSubSubNestedTitle${index}_${subIndex}_${nestedIndex}_${subNestedIndex}_${subSubNestedIndex}`} className="form-label"><strong>Default SubSubNestedTitle:</strong></label>
                                                                            <div id={`defaultSubSubNestedTitle${index}_${subIndex}_${nestedIndex}_${subNestedIndex}_${subSubNestedIndex}`}><em>{subSubNestedTitle?.subSubNestedTitleLabel ?? 'No sub-subnested title'}</em></div>
                                                                        </div>

                                                                        {/* Form fields for editing sub-sub-nested title */}
                                                                        {/* Form fields for editing sub-sub-nested title */}
<form>
  <div className="mb-3">
    <label htmlFor={`subSubNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}_${subSubNestedIndex}`} className="form-label">
      <strong>Edit SubSubNestedTitle:</strong>
    </label>
    <input
      type="text"
      className="form-control"
      id={`subSubNestedTitleInput${index}_${subIndex}_${nestedIndex}_${subNestedIndex}_${subSubNestedIndex}`}
      value={
        // Access the edited value from state or fallback to the original value
        editedSubSubNestedTitles[`${title._id}-${subTitle._id}-${nestedTitle._id}-${subNestedTitle._id}-${subSubNestedTitle._id}`] || 
        subSubNestedTitle.subSubNestedTitleLabel || '' // Fallback to the original value or empty string
      }
      onChange={(e) => handleSubSubNestedTitleChange(
        e,
        title._id,
        subTitle._id,
        nestedTitle._id,
        subNestedTitle._id,
        subSubNestedTitle._id
      )}
    />
  </div>
</form>

                                                                    </div>
                                                                ))}
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
                                        <button type="button" className="btn btn-primary" onClick={() => handleFormSubmit()}>Save changes</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        

                        <button
  className="btn btn-danger"
  data-bs-toggle={`modal`}
  data-bs-target={`#exampleModal${index}`} // Unique modal ID for each title
  onClick={() => {
    setTitleToDelete(title._id); // Set title ID to delete
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
                                        onClick={() => deleteTitle()} // Add onClick handler to trigger the delete action
                                    >
                                        Delete
                                    </button>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    
                </div>
            ))}

            {/* Pagination controls */}
    <div className="pagination-controls">
      <button className="btn btn-primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  </div>
    );
};

export default TitleTab;
