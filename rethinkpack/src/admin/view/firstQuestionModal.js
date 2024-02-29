import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class FirstQuestionModal extends Component {
  constructor(props) {
    super(props);
    // Declare all state variables to observe below
    this.state = {
      title: {
        titleLabel: '',
        subTitle: [
          {
            subTitleLabel: '',
            nestedTitle: [
              { 
                nestedTitleLabel: '', 
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
      openFirstQuestionModal: props.openFirstQuestionModal,
      firstQuestionId: props.firstQuestionId,
      firstQuestionValue: props.firstQuestionValue
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.insertTitle = this.insertTitle.bind(this);
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast
    });
  }

  /*--------------onClick-----------------*/

  

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
    const { showModal, openFirstQuestionModal, firstQuestionValue } = this.state;
    // console.log(`showModal: ${showModal}`)
    console.log(`openFirstQuestionModal: ${openFirstQuestionModal}`)
    console.log(`firstQuestionValue: ${firstQuestionValue}`)

    this.setState({ showModal: openFirstQuestionModal });
    
  }

  componentWillUnmount() {

  }

  /*----------- function helpers ----------------------*/

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };


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

    const { validationErrors, firstQuestionId, firstQuestionValue } = this.state;

    return (

      <div>
        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.setState({ showModal: false },
              this.resetState
            )
          }
          }
          className=""
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
              A first question already exists:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              {/* Title 0 */}
              <div className="mb-3">
                <label htmlFor="question" className="col-form-label">
                  Existing first question:
                </label>
                <div>
                  <label htmlFor="question" className="col-form-label">
                    {firstQuestionValue}
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    id="formQuestion"
                    value={firstQuestionValue}
                    onChange={this.handleTitleLabel}
                  />
                </div>
                {validationErrors.titleLabel && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.titleLabel}
                  </div>
                )}
              </div>
              
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

export default FirstQuestionModal;