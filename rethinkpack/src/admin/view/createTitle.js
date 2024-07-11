import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

class CreateTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: {
        titleLabel: '',
        subTitle: [
          {
            subTitleLabel: '',
            nestedTitle: [
              {
                nestedTitleLabel: '',
                subNestedTitle: [
                  { subNestedTitleLabel: '',
                    subSubNestedTitle: [
                      { subSubNestedTitleLabel: '' } // New addition for sub-sub nested titles
                    ]
                   }
                ],
                
                
              }
            ],
          }
        ],
      },
      validationErrors: {
        titleLabel: '',
        subTitleLabel: '',
        nestedTitleLabel: '',
        subNestedTitleLabel: '',
        subSubNestedTitleLabel: '' // Validation error for sub-sub nested titles
      },
      showModal: false,
    };
    

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.onEditClickHandler = this.onEditClickHandler.bind(this);
    this.insertTitle = this.insertTitle.bind(this);
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast
    });
  }

  onEditClickHandler = () => {
    this.setState({ showModal: true });
  };

  
  insertTitle = async (dataToInsert) => {
    console.log(dataToInsert);
    try {
      const response = await fetch(`http://${destination}/api/insertTitle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToInsert),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        console.log(dataToInsert);
        this.setState({ showToast: true });
        setTimeout(() => this.setState({ showToast: false }), 5000);
        this.resetState();
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  handleTitleLabel = (e) => {
    this.setState((prevState) => ({
      title: { ...prevState.title, titleLabel: e.target.value }
    }));
  };

  handleSubTitleLabel = (index, value) => {
    const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: title?.subTitle?.map((subTitleElem, i) =>
          i === index ? { ...subTitleElem, subTitleLabel: value } : subTitleElem
        ),
      },
    }));
  };

  handleNestedTitleLabel = (index_sub, index_nest, value) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === index_sub
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle.map((nestedTitleElem, j) =>
                j === index_nest ? { ...nestedTitleElem, nestedTitleLabel: value } : nestedTitleElem
              ),
            }
            : subTitleElem
        ),
      },
    }));
  };

  handleSubNestedTitleLabel = (index_sub, index_nest, index_sub_nest, value) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === index_sub
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, j) =>
                j === index_nest
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: nestedTitleElem.subNestedTitle?.map((subNestedTitleElem, k) =>
                      k === index_sub_nest ? { ...subNestedTitleElem, subNestedTitleLabel: value } : subNestedTitleElem
                    )
                  }
                  : nestedTitleElem
              ),
            }
            : subTitleElem
        ),
      },
    }));
  };

  handleSubSubNestedTitleLabel = (index_sub, index_nest, index_sub_nest, index_sub_sub_nest, value) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, subTitleIndex) =>
          subTitleIndex === index_sub
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, nestedTitleIndex) =>
                nestedTitleIndex === index_nest
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: nestedTitleElem.subNestedTitle?.map((subNestedTitleElem, subNestedTitleIndex) =>
                      subNestedTitleIndex === index_sub_nest
                        ? {
                          ...subNestedTitleElem,
                          subSubNestedTitle: subNestedTitleElem.subSubNestedTitle?.map((subSubNestedTitleElem, subSubNestedTitleIndex) =>
                            subSubNestedTitleIndex === index_sub_sub_nest
                              ? {
                                 ...subSubNestedTitleElem, subSubNestedTitleLabel: value }
                              : subSubNestedTitleElem
                          )
                        }
                        : subNestedTitleElem
                    )
                  }
                  : nestedTitleElem
              )
            }
            : subTitleElem
        )
      }
    }));
  };
  
  
  
  addSubSubNestedTitle = (subtitleIndex, nestedTitleIndex, subnesttitleIndex, e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, j) =>
                j === nestedTitleIndex
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: nestedTitleElem.subNestedTitle?.map((subNestedTitleElem, k) =>
                      k === subnesttitleIndex
                        ? {
                          ...subNestedTitleElem,
                          subSubNestedTitle: [
                            ...(subNestedTitleElem.subSubNestedTitle || []),
                            { subSubNestedTitleLabel: '' }
                          ]
                        }
                        : subNestedTitleElem
                    )
                  }
                  : nestedTitleElem
              )
            }
            : subTitleElem
        )
      }
    }));
  };
  
  // addSubSubNestedTitle = (subtitleIndex, nestedTitleIndex,subnesttitleIndex e) => {
  //   e.preventDefault();
  //   this.setState((prevState) => ({
  //     title: {
  //       ...prevState.title,
  //       subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
  //         i === subtitleIndex
  //           ? {
  //             ...subTitleElem,
  //             nestedTitle: subTitleElem.nestedTitle.map((nestedTitleElem, j) =>
  //               j === nestedTitleIndex
  //                 ? {
  //                   ...nestedTitleElem,
  //                   subNestedTitle: nestedTitleElem.subNestedTitle.map((subNestedTitleElem, k)=>
  //                     k===subnesttitleIndex ?{
  //                       ...subNestedTitleElem,
  //                       subSubNestedTitle: [
  //                         ...nestedTitleElem.subSubNestedTitle,
  //                         { subSubNestedTitleLabel: '' }
  //                       ]
  //                     }:subNestedTitleElem
  //                     }
  //                 : nestedTitleElem
  //             )
  //           }
  //           : subTitleElem
  //       )
  //     }
  //   }));
  // };
  
  deleteSubSubNestedTitle = (subtitleIndex, nestedTitleIndex, subNestedTitleIndex, subSubNestedTitleIndex) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, j) =>
                j === nestedTitleIndex
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: nestedTitleElem.subNestedTitle?.map((subNestedTitleElem, k) =>
                      k === subNestedTitleIndex
                        ? {
                          ...subNestedTitleElem,
                          subSubNestedTitle: subNestedTitleElem.subSubNestedTitle.filter((_, l) => l !== subSubNestedTitleIndex)
                        }
                        : subNestedTitleElem
                    )
                  }
                  : nestedTitleElem
              )
            }
            : subTitleElem
        )
      }
    }));
  };
  

  addSubTitle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: [
          ...prevState.title.subTitle,
          { subTitleLabel: '', nestedTitle: [{ nestedTitleLabel: '', subNestedTitle: [{ subNestedTitleLabel: '' }] }] }
        ]
      }
    }));
  };

  deleteSubTitle = (index) => {
    this.setState(prevState => ({
      title: { ...prevState.title, subTitle: prevState.title.subTitle.filter((_, i) => i !== index) }
    }));
  };

  addNestedTitle = (subtitleIndex, e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: [
                ...subTitleElem.nestedTitle,
                { nestedTitleLabel: '', subNestedTitle: [{ subNestedTitleLabel: '' }] }
              ],
            }
            : subTitleElem
        ),
      },
    }));
  };

  deleteNestedTitle = (subtitleIndex, nestedTitleIndex) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle.filter((_, j) => j !== nestedTitleIndex)
            }
            : subTitleElem
        )
      }
    }));
  };

  addSubNestedTitle = (subtitleIndex, nestedTitleIndex, e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, j) =>
                j === nestedTitleIndex
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: [
                      ...nestedTitleElem.subNestedTitle,
                      { subNestedTitleLabel: '' }
                    ]
                  }
                  : nestedTitleElem
              )
            }
            : subTitleElem
        )
      }
    }));
  };

  deleteSubNestedTitle = (subtitleIndex, nestedTitleIndex, subNestedTitleIndex) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title?.subTitle?.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle?.map((nestedTitleElem, j) =>
                j === nestedTitleIndex
                  ? {
                    ...nestedTitleElem,
                    subNestedTitle: nestedTitleElem.subNestedTitle.filter((_, k) => k !== subNestedTitleIndex)
                  }
                  : nestedTitleElem
              )
            }
            : subTitleElem
        )
      }
    }));
  };

  validateTitleLabel = () => {
    const { title } = this.state;
    return title.titleLabel.trim() !== '';
  };

  validateSubTitleLabel = () => {
    const { title } = this.state;
    for (let i = 0; i < title.subTitle.length; i++) {
      if (title.subTitle[i].subTitleLabel.trim() === '') {
        return false;
      }
    }
    return true;
  };

  validateNestedTitleLabel = () => {
    const { title } = this.state;
    for (let i = 0; i < title.subTitle.length; i++) {
      for (let j = 0; j < title.subTitle[i].nestedTitle.length; j++) {
        if (title.subTitle[i].nestedTitle[j].nestedTitleLabel.trim() === '') {
          return false;
        }
      }
    }
    return true;
  };

  validateSubNestedTitleLabel = () => {
    const { title } = this.state;
    for (let i = 0; i < title.subTitle.length; i++) {
      for (let j = 0; j < title.subTitle[i].nestedTitle.length; j++) {
        for (let k = 0; k < title.subTitle[i].nestedTitle[j].subNestedTitle.length; k++) {
          if (title.subTitle[i].nestedTitle[j].subNestedTitle[k].subNestedTitleLabel.trim() === '') {
            return false;
          }
        }
      }
    }
    return true;
  };

  validateSubSubNestedTitleLabel = () => {
    const { title } = this.state;
    for (let i = 0; i < title.subTitle.length; i++) {
      for (let j = 0; j < title.subTitle[i].nestedTitle.length; j++) {
        for(let l=0;l<<title.subTitle[i].nestedTitle[j].subNestedTitle.length;l++){
        for (let k = 0; k < title.subTitle[i].nestedTitle[j].subNestedTitle[l].subSubNestedTitle.length; k++) {
          if (title.subTitle[i].nestedTitle[j].subNestedTitle[l].subSubNestedTitle[k].subSubNestedTitleLabel.trim() === '') {
            return false;
          }
        }
      }
      }
    }
    return true;
  };
  

  renderToast() {
    if (this.state.showToast) {
      return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-dark text-white">
            <div className="d-flex justify-content-between">
              <div className="toast-body">
                Created title successfully!
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => this.setState({ showToast: false })}></button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title } = this.state;
    const isTitleLabelValid = this.validateTitleLabel();
    const isSubTitleLabelValid = this.validateSubTitleLabel();
    const isNestedTitleLabelValid = this.validateNestedTitleLabel();
    const isSubNestedTitleLabelValid = this.validateSubNestedTitleLabel();
    const isSubSubNestedTitleLabelValid = this.validateSubSubNestedTitleLabel();

    this.setState({
      validationErrors: {
        titleLabel: isTitleLabelValid ? '' : 'Enter the title',
        subTitleLabel: isSubTitleLabelValid ? '' : 'Enter all subtitles',
        nestedTitleLabel: isNestedTitleLabelValid ? '' : 'Enter all nested titles',
        subNestedTitleLabel: isSubNestedTitleLabelValid ? '' : 'Enter all sub nested titles',
        subSubNestedTitleLabel: isSubSubNestedTitleLabelValid ? '' : 'Enter all sub sub nested titles'
        
      },
    });

    if (!isTitleLabelValid || !isSubTitleLabelValid || !isNestedTitleLabelValid || !isSubNestedTitleLabelValid || !isSubSubNestedTitleLabelValid) {
      return;
    }

    const dataToInsert = {
      title: title
    };

    this.insertTitle(dataToInsert);
    this.setState({ showModal: false });
  };

  render() {
    const { validationErrors, questionIndex, title } = this.state;
    return (
      <div>
        <button
          className="btn btn-dark d-none d-md-inline-block"
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler()}
        >
          Create Title
        </button>

        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.setState({ showModal: false }, this.resetState);
          }}
          className="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="question" className="col-form-label">
                  Title:
                </label>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    id="formQuestion"
                    value={this.state.title.titleLabel}
                    onChange={this.handleTitleLabel}
                  />
                </div>
                {validationErrors.titleLabel && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.titleLabel}
                  </div>
                )}
              </div>
              

    {this.state.title?.subTitle?.map((subTitleElem, index) => (
  <ul key={`sub_${index}`}>
    <li>
     <div className="mb-3 d-flex align-items-center mb-2">
                      <label htmlFor="question" className="col-form-label">
                        Subtitle:
                      </label>
                      <div className="d-flex flex-grow-1 mx-2">
                        <input
                          type="text"
                          className="form-control mx-2"
                          id="formSubTitle"
                          value={title.subTitle[index].subTitleLabel}
                          onChange={(e) => this.handleSubTitleLabel(index, e.target.value)}
                        />
                      </div>
                      {title.subTitle.length > 1 && (
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => this.deleteSubTitle(index)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
    </li>
    {subTitleElem.nestedTitle?.map((nestedTitleElem, index_nest) => (
      <ul key={`nest_${index}_${index_nest}`}>
        <li>
          <div className="mb-3 d-flex align-items-center mb-2">
                          <label htmlFor="question" className="col-form-label">
                            Nested Title:
                          </label>
                          <div className="d-flex flex-grow-1 mx-2">
                            <input
                              type="text"
                              className="form-control mx-2"
                              id="formNestedTitle"
                              value={title.subTitle[index].nestedTitle[index_nest].nestedTitleLabel}
                              onChange={(e) => this.handleNestedTitleLabel(index, index_nest, e.target.value)}
                            />
                          </div>
                          {title.subTitle[index].nestedTitle.length > 1 && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => this.deleteNestedTitle(index, index_nest)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
        </li>
        {nestedTitleElem.subNestedTitle?.map((subNestedTitleElem, index_sub_nest) => (
          <ul key={`sub_nest_${index}_${index_nest}_${index_sub_nest}`}>
            <li>
              <div className="mb-3 d-flex align-items-center mb-2">
                              <label htmlFor="question" className="col-form-label">
                                Sub Nested Title:
                              </label>
                              <div className="d-flex flex-grow-1 mx-2">
                                <input
                                  type="text"
                                  className="form-control mx-2"
                                  id="formSubNestedTitle"
                                  value={title.subTitle[index].nestedTitle[index_nest].subNestedTitle[index_sub_nest].subNestedTitleLabel}
                                  onChange={(e) => this.handleSubNestedTitleLabel(index, index_nest, index_sub_nest, e.target.value)}
                                />
                              </div>
                              {title.subTitle[index].nestedTitle[index_nest].subNestedTitle.length > 1 && (
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => this.deleteSubNestedTitle(index, index_nest, index_sub_nest)}
                                >
                                  &times;
                                </button>
                              )}
                            </div>
            </li>
            {subNestedTitleElem.subSubNestedTitle?.map((subSubNestedTitleElem, index_sub_sub_nest) => (
          <ul key={`sub_sub_nest_${index}_${index_nest}_${index_sub_nest}_${index_sub_sub_nest}`}>
            <li>
              <div className="mb-3 d-flex align-items-center mb-2">
                <label htmlFor="question" className="col-form-label">
                  Sub Sub Nested Title:
                </label>
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    className="form-control mx-2"
                    id="formSubSubNestedTitle"
                    value={title.subTitle[index].nestedTitle[index_nest].subNestedTitle[index_sub_nest].subSubNestedTitle[index_sub_sub_nest].subSubNestedTitleLabel}
                    onChange={(e) => this.handleSubSubNestedTitleLabel(index, index_nest,index_sub_nest, index_sub_sub_nest, e.target.value)}
                  />
                </div>
                {title.subTitle[index].nestedTitle[index_nest].subNestedTitle[index_sub_nest].subSubNestedTitle.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteSubSubNestedTitle(index, index_nest,index_sub_nest, index_sub_sub_nest)}
                  >
                    &times;
                  </button>
                )}
              </div>
            </li>
          </ul>
        ))}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-dark"
            onClick={(e) => this.addSubSubNestedTitle(index, index_nest,index_sub_nest ,e)}
          >
            Add sub sub nested title
          </button>
        </div>
          </ul>
        ))}
        {/* New UI for Sub-Sub Nested Titles */}
        
      </ul>
    ))}
    {/* Add Nested Title Button */}
    <div className="d-flex align-items-center">
      <button
        className="btn btn-outline-dark"
        onClick={(e) => this.addNestedTitle(index, e)}
      >
        Add nested title
      </button>
    </div>
  </ul>
))}
{/* Add Subtitle Button */}
<div className="d-flex align-items-center">
  <button className="btn btn-outline-dark" onClick={this.addSubTitle}>
    Add subtitle
  </button>
</div>

            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100">
              <div className="form-check form-switch form-check-inline"></div>
              <button type="button" className="btn btn-dark" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>

            {validationErrors.subTitleLabel && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {validationErrors.subTitleLabel}
              </div>
            )}
            {validationErrors.nestedTitleLabel && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {validationErrors.nestedTitleLabel}
              </div>
            )}
            {validationErrors.subNestedTitleLabel && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {validationErrors.subNestedTitleLabel}
              </div>
            )}
          </Modal.Footer>
        </Modal>
        {this.renderToast()}
      </div>
    );}
  
}

export default CreateTitle;
