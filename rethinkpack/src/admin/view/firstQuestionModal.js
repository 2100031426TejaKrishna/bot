import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';
import './firstQuestionModal.css';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class FirstQuestionModal extends Component {
  constructor(props) {
    super(props);
    // Declare all state variables to observe below
    this.state = {
      showModal: false,
      openFirstQuestionModal: props.openFirstQuestionModal,
      type: props.type,
      country: props.country,
      firstQuestionId: props.firstQuestionId,
      firstQuestionValue: props.firstQuestionValue,
      nestedTitleId: props.nestedTitleId,
      nestedTitleLabel: props.nestedTitleLabel
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast
    });
  }

  /*--------------API-----------------*/

  removeCountryExistingFirstQuestion = async (firstQuestionId) => {
    const { country } = this.state;

    const dataToUpdate = {
      country: {
        selectedCountry: country,
        countryFirstQuestion: false
      }
    };
   
    try {
      const response = await fetch(`http://${destination}/api/update/${firstQuestionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      })
      if (response.ok) {
        console.log('Data submitted successfully');
        this.setState({ 
          showModal: false,
          showToast: true 
        });
        setTimeout(() => this.setState({ showToast: false }), 10000);

        // Pass props to createQuestion.js to toggle firstQuestion to true and dataToInsert
        this.props.updateFirstQuestion();
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  removeNestedTitleExistingFirstQuestion = async (firstQuestionId) => {
    const { nestedTitleId } = this.state;    

    const dataToUpdate = {
      nestedTitle: {
        id: nestedTitleId,
        firstQuestion: false
      }
    };
   
    try {
      const response = await fetch(`http://${destination}/api/update/${firstQuestionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      })
      if (response.ok) {
        console.log('Data submitted successfully');
        this.setState({ 
          showModal: false,
          showToast: true 
        });
        setTimeout(() => this.setState({ showToast: false }), 10000);

        // Pass props to createQuestion.js to toggle firstQuestion to true and dataToInsert
        this.props.updateFirstQuestion();
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
    const { openFirstQuestionModal } = this.state;
    this.setState({ showModal: openFirstQuestionModal });
  }

  componentWillUnmount() {
    
  }

  renderToast() {
    if (this.state.showToast) {
      return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-dark text-white">
            <div className="d-flex justify-content-between">
              <div className="toast-body">
                First question updated!
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => this.setState({ showToast: false })}></button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  /*---------------------RENDER----------------------------------*/

  render() {

    const { firstQuestionId, firstQuestionValue, type, country, nestedTitleLabel } = this.state;

    return (

      <div>
        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.props.firstQuestionModalOnHide();
            this.setState({ showModal: false },
              this.resetState
            )
          }
          }
          className="firstQuestionModal"
        >
          {/* Modal content */}
          <Modal.Header
            className="modal-header"
            closeButton
          >
            {/* Country */}
            {(type === "country") && (
              <Modal.Title
                className="modal-title fs-5"
                id="firstQuestionModalLabel"
              >
                A first question already exists for {country} 
              </Modal.Title>
            )}
            {/* NestedTitle */}
            {(type === "nestedTitle") && (
              <Modal.Title
                className="modal-title fs-5"
                id="firstQuestionModalLabel"
              >
                A first question already exists for {nestedTitleLabel}
              </Modal.Title>
            )}  
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="d-flex justify-content-center">
                <label htmlFor="question" className="col-form-label">
                  Existing first question:
                </label>                
              </div>
              <div className="d-flex justify-content-center">
                <strong>
                  {firstQuestionValue}
                </strong>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-around w-100">
              <button 
                className="btn btn-primary" 
                id="btKeep"
                onClick={() => 
                  {
                    this.props.firstQuestionModalOnHide();
                    this.setState({ showModal: false },
                      this.resetState
                    )
                  } 
                }
              >
                Keep
              </button>
              {(type === "country") && (
                <button 
                  className="btn btn-danger" 
                  id="btRemove"
                  onClick={() => this.removeCountryExistingFirstQuestion(firstQuestionId)}
                >
                  Remove
                </button>
              )}
              {(type === "nestedTitle") && (
                <button 
                  className="btn btn-danger" 
                  id="btRemove"
                  onClick={() => this.removeNestedTitleExistingFirstQuestion(firstQuestionId)}
                >
                  Remove
                </button>
              )}
            </div>
          </Modal.Footer>
        </Modal>
        {this.renderToast()}
      </div>
    );
  }
}

export default FirstQuestionModal;