import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

class CreateTitle extends Component {
  constructor(props) {
    super(props);
    // Declare all state variables to observe below
    this.state = {
      title: {
        titleLabel: '',
        subTitle: [
          {
            subTitleLabel: '',
            // questionsSubTitle: [],
            nestedTitle: [
              { 
                nestedTitleLabel: '', 
                // questionsNestedTitle: [] 
              }
            ]
          }
        ],
      },
      validationErrors: {
        titleLabel: '',
        subTitleLabel: '',
        nestedTitleLabel: ''
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

  /*--------------onClick-----------------*/

  onEditClickHandler = () => {
    this.setState( { showModal: true } )
  };

  /*--------------API-----------------*/

  insertTitle = async (dataToInsert) => {
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
        
        // refresh here
        this.setState({ showToast: true });
        setTimeout(() => this.setState({ showToast: false }), 5000);
        this.resetState()
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
        console.error('Network error:', error);
    }
  };

  /*-------------MODAL-----------------*/

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  /*----------- function helpers ----------------------*/

  //
  handleTitleLabel = (e) => {
    this.setState((prevState) => ({
      title: { ...prevState.title, titleLabel: e.target.value }
    }))
  };

  handleSubTitleLabel = (index, value) => {
    const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: title.subTitle.map((subTitleElem, i) =>
          i === index ? { ...subTitleElem, subTitleLabel: value } : subTitleElem
        ),
      },
    }));
  };

  handleNestedTitleLabel = (index_sub, index_nest, value) => {
    // const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
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

  addSubTitle = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: [
          ...prevState.title.subTitle,
          { subTitleLabel: "", nestedTitle: [{ nestedTitleLabel: '' }] }
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
    e.preventDefault(); // Prevent the default action of the button click (accidental form submission)
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: [
                ...subTitleElem.nestedTitle,
                { nestedTitleLabel: '' },
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
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
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

  // --------------- VALIDATIONS---------------------------------

  validateTitleLabel = () => {
    const { title } = this.state;
    return title.titleLabel.trim() !== '';
  };
  
  validateSubTitleLabel = () => {
    const { title } = this.state;

    for (let i=0; i<title.subTitle.length; i++) {
      // case when field is empty
      if (title.subTitle[i].subTitleLabel.trim() === '') {
        return false;
      }
    };
    // case when all fields are not empty
    return true;
  };

  validateNestedTitleLabel = () => {
    const { title } = this.state;

    for (let i=0; i<title.subTitle.length; i++) {
      for (let j=0; j<title.subTitle[i].nestedTitle.length; j++) {
        // case when field is empty
        if (title.subTitle[i].nestedTitle[j].nestedTitleLabel.trim() === '') {
          return false;
        }
      }
    };
    // case when all fields are not empty
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

  // -------------------------- HANDLE SUBMIT ------------------------------

  handleSubmit = async (e) => {
    e.preventDefault();

    const { title } = this.state

    const isTitleLabelValid = this.validateTitleLabel();
    const isSubTitleLabelValid = this.validateSubTitleLabel();
    const isNestedTitleLabelValid = this.validateNestedTitleLabel();

    this.setState({
      validationErrors: {
        titleLabel: isTitleLabelValid ? '' : 'Enter the title',
        subTitleLabel: isSubTitleLabelValid ? '' : 'Enter all subtitles',
        nestedTitleLabel: isNestedTitleLabelValid ? '' : 'Enter all nested titles'
      },
    });

    if (
      !isTitleLabelValid  || 
      !isSubTitleLabelValid || 
      !isNestedTitleLabelValid
    ) {
      // exit out of handleSubmit
      return;
    }

    const dataToInsert = {
      title: title
    };

    // debug
    // print title label
    // console.log(`titleLabel: ${this.state.title.titleLabel}`)

    // // print labels
    // for (let i = 0; i < title.subTitle.length; i++) {

    //   // subtitle labels
    //   console.log(`subtitleLabel[${i}]: ${title.subTitle[i].subTitleLabel}`)

    //   // nested title labels
    //   for (let j = 0; j < title.subTitle[i].nestedTitle.length; j++) {
    //     console.log(`nestedLabel[${i}][${j}]: ${title.subTitle[i].nestedTitle[j].nestedTitleLabel}`)
    //   }
    // }
    // console.log(JSON.stringify(dataToInsert))
    //

    // Insert database server API
    this.insertTitle(dataToInsert);

    // close modal
    this.setState( { showModal: false } )
  };

  /*---------------------RENDER----------------------------------*/

  render() {

    const { validationErrors, questionIndex, title } = this.state;

    return (

      <div>

        <button
          // className="btn btn-primary"
          className="btn btn-dark d-none d-md-inline-block"
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler()}>
          Create Title
        </button>

        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.setState({ showModal: false },
              this.resetState
            )
          }
          }
          className="modal-lg"
        >
          {/* Modal content */}
          <Modal.Header
            className="modal-header"
            closeButton
          >
            <Modal.Title
              className="modal-title fs-5"
              id="createTitleLabel"
            >
              Create Title
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              {/* Title 0 */}
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
              {/* SubTitle loop */}
              {this.state.title.subTitle.map((subTitleElem, index) => (
                <ul>
                  {/* Title 1 */}
                  <li key={`sub_${index}`}>
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
                  {/* Nested Title Loop */}
                  {subTitleElem.nestedTitle && subTitleElem.nestedTitle.map((nestedTitleElem, index_nest) => (
                    <ul>
                      <li key={`nest_${index}_${index_nest}`}>
                        {/* Title 2 */}
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
                          {/* Delete nestedTitle */}
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
                    </ul>
                  ))}
                  {/* Add nestedTitle */}
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
              {/* Add subTitle button */}
              <div className="d-flex align-items-center">
                <button className="btn btn-outline-dark" onClick={this.addSubTitle}>
                  Add subtitle
                </button>
              </div>
              {/* {validationErrors.subTitleLabel && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.subTitleLabel}
                </div>
              )} */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100">

              <div className="form-check form-switch form-check-inline">
              {/* {validationErrors.nestedTitleLabel && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.nestedTitleLabel}
                </div>
              )} */}
              </div>
              <button type="button" className="btn btn-dark" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>
            {/* Subtitle validation */}
            {validationErrors.subTitleLabel && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {validationErrors.subTitleLabel}
              </div>
            )}
            {/* Nested title validation */}
            {validationErrors.nestedTitleLabel && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {validationErrors.nestedTitleLabel}
              </div>
            )}
          </Modal.Footer>
        </Modal>
        {this.renderToast()}
      </div>
    );
  }
}

export default CreateTitle;