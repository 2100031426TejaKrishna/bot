// test git push

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class CreateTitle extends Component {
  constructor(props) {
    super(props);
    // Declare all state variables to observe below
    this.state = {
      //
      title: {
        titleLabel: '',
        subTitle: [ 
          {
            subTitleLabel: '', nestedTitle: [ { nestedTitleLabel: '' } ]
          }
        ],
      },
      //
      question: '',
      validationErrors: {
        questionType: '',
        question: '',
        optionType: '',
        grid: '',
        options: '',
        openEnded: '',
        marks: '',
        country: '',
        explanation: '',
      },
      requireResponse: false,
      // Additional variables
      questionIndex: props.index,
      questionId: props.questionId,
      allQuestions: [],
      questionList: {
        question: null, 
        questionType: '',
        optionType: 'multipleChoice',
        options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false, optionsNextQuestion: null }],
        linearScale: [],
        openEndedText: '',
        marks: '',
        firstQuestion: false,
        nextQuestion: null
      },
      openEndedWordLimit: 500,
      openEndedWordCount: 0,
      stateQuestionId: '',
      showModal: false,
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.onEditClickHandler = this.onEditClickHandler.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast 
    });
  }

/*--------------onClick-----------------*/

  onEditClickHandler = (id) => {
    // Load all questions
    this.fetchQuestions().then(
      // Load specific question
      this.fetchQuestion(id)
    );
  }

/*--------------API-----------------*/
  
  fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/read/${questionId}`);
      const data = await response.json();
      if (data) {
        this.setState({
          showModal: true, 
          questionList: data,
          selectedOption: data.optionType,
          gridOptions: data.grid,
          isLeadingQuestion: (data.marks) ? false : true
        })
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  fetchQuestions = async () => {
    try {
      const response = await fetch(`http://${destination}/api/displayAllQuestions`);
      const questions = await response.json();
      this.setState({ allQuestions: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  updateQuestion = async(questionId, dataToUpdate) => {
    try {
      const response = await fetch(`http://${destination}/api/update/${questionId}`, {
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

        // Trigger re-fetch in parent component questions.js
        this.props.refreshQuestions();
 
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    // debug
    // console.log(`questionList: ${JSON.stringify(this.state.questionList)}`)
  };

/*-------------MODAL-----------------*/

  componentDidMount() {
    
  }

  componentWillUnmount() {

  }

/*----------- function helpers ----------------------*/

  //
  handleTitleLabel = (e) => {
    this.setState( (prevState) => ({
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

  // handleNestedTitleLabel = (index_sub, index_nest, value) => {
  //   const { title } = this.state;
  //   this.setState((prevState) => ({
  //     title: {
  //       ...prevState.title,
  //       ...prevState.title.subTitle[index_sub],
  //       nestedTitle: title.subTitle[index_sub].nestedTitle.map((nestedTitleElem, i) =>
  //           i === index_nest ? { ...nestedTitleElem, nestedTitleLabel: value } : nestedTitleElem
  //       ),
  //     },
  //   }),
  //     () => {
  //       console.log(`nestedLabel [0][0]: ${title.subTitle[0].nestedTitle[0].nestedTitleLabel}`)
  //       // console.log(`nestedLabel [0][1]: ${title.subTitle[0].nestedTitle[1].nestedTitleLabel}`)
  //       // console.log(`nestedLabel [1][0]: ${title.subTitle[1].nestedTitle[0].nestedTitleLabel}`)
  //       // console.log(`nestedLabel [1][1]: ${title.subTitle[1].nestedTitle[1].nestedTitleLabel}`)
  //     }
  //   );
  // };

  handleNestedTitleLabel = (index_sub, index_nest, value) => {
    const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, nestedTitleElem, i) =>
          i === index_sub
            ? {
                ...subTitleElem,
                nestedTitle: subTitleElem.nestedTitle.map((nestedTitleElem, j) =>
                  j === index_nest ? { ...nestedTitleElem, nestedTitleLabel: value } : nestedTitleElem
                ),
              }
            : nestedTitleElem
        ),
      },
    }),
     () => {
            console.log(`nestedLabel [0][0]: ${title.subTitle[0].nestedTitle[0].nestedTitleLabel}`)
            // console.log(`nestedLabel [0][1]: ${title.subTitle[0].nestedTitle[1].nestedTitleLabel}`)
            // console.log(`nestedLabel [1][0]: ${title.subTitle[1].nestedTitle[0].nestedTitleLabel}`)
            // console.log(`nestedLabel [1][1]: ${title.subTitle[1].nestedTitle[1].nestedTitleLabel}`)
          }
    );
  };



  //

  handleQuestionMarks = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, marks: e.target.value }
    }))
  }

  handleQuestionNextQuestion = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, nextQuestion: e.target.value }
    }))
  }

  addSubTitle = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: [
          ...prevState.title.subTitle,
          { subTitleLabel: "", nestedTitle: [ { nestedTitleLabel: '' } ] }
        ]
      }
    }));
  };

  deleteSubTitle = (index) => {
    this.setState(prevState => ({
      title: { ...prevState.title, subTitle: prevState.title.subTitle.filter((_, i) => i !== index) }
    }));
  };

  addNestedTitle = (index, e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        ...prevState.title.subTitle[index],
        nestedTitle: [ { nestedTitleLabel: '' } ]
      }
    }));
  };
  

  // --------------- VALIDATIONS---------------------------------

  validateQuestionType = () => {
    const { questionList } = this.state;
    return questionList.questionType !== '';
  };
  
  validateQuestion = () => {
    const { questionList } = this.state;
    return questionList.question.trim() !== '';
  };
  
  validateOptionType = () => {
    const { questionList } = this.state;
    return questionList.optionType !== '';
  };
  
  renderToast() {
    if (this.state.showToast) {
      return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-dark text-white">
            <div className="d-flex justify-content-between">
              <div className="toast-body">
                Edited question successfully!
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

    // const isQuestionTypeValid = this.validateQuestionType();
    // const isQuestionValid = this.validateQuestion();
    // const isOptionTypeValid = this.validateOptionType();
    // const isOptionsValid = this.validateOptions();
    // const isMarksValid = this.validateMarks();
    // const isCountriesValid = this.validateCountries();
    // const isExplanationValid = this.validateExplanation();
    // const isGridValid = this.validateGrid();

    // this.setState({
    //   validationErrors: {
    //     questionType: isQuestionTypeValid ? '' : 'Select one question type',
    //     question: isQuestionValid ? '' : 'Enter the question',
    //     optionType: isOptionTypeValid ? '' : 'Select an option type',
    //     grid: isGridValid ? '' : 'Complete all grid data entry and ensure there is one selection per row',
    //     options: isOptionsValid ? '' : 'Add at least two options and at least one selection',
    //     marks: isMarksValid ? '' : 'Enter the marks (an integer value) for this question',
    //     country: isCountriesValid ? '' : 'Select at least one country',
    //     explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
    //   },
    // });

    // if (
    //   !isQuestionTypeValid || 
    //   !isQuestionValid || 
    //   !isOptionTypeValid || 
    //   !isGridValid || 
    //   !isOptionsValid || 
    //   !isMarksValid || 
    //   !isCountriesValid || 
    //   !isExplanationValid
    // ) {
    //   return;
    // }

    // const {
    //   // isLeadingQuestion,
    // } = this.state;

    // const dataToUpdate = {
    //   questionType: this.state.questionList.questionType,
    //   question: this.state.questionList.question,
    //   optionType: this.state.questionList.optionType,
    //   options: this.state.questionList.options,
    // };

    // // Leading Question Marks check
    // if (isLeadingQuestion === true) {
    //   // Case when isLeadingQuestion is true, set marks to null
    //   dataToUpdate.marks = null
    // }
    
    // Update database server API
    // this.updateQuestion(questionId, dataToUpdate)

    // debug
    // print title label
    console.log(`titleLabel: ${this.state.title.titleLabel}`)

    // print subtitle labels
    for (let i=0; i<title.subTitle.length; i++) {
      console.log(`subtitleLabel: ${title.subTitle[i].subTitleLabel}`)
    }
  };

/*---------------------RENDER----------------------------------*/

  render() {

    const { showCountry, isLeadingQuestion, showExplanation, validationErrors, questionId, questionIndex, allQuestions, title } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';

    return (
      
      <div>
        
        <button 
          // className="btn btn-primary"
          className="btn btn-dark d-none d-md-inline-block"
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler(questionId)}>
            Create Title
        </button>

        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.setState({ showModal: false },
            this.resetState
            )}
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
              id="editQuestionLabel"
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
                {validationErrors.question && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.question}
                  </div>
                )}
              </div>
              {this.state.title.subTitle.map((subTitleElem, index) => (
              <ul>
                {/* Title 1 */}
                
                  <li key={index}>
                    <div className="mb-3 d-flex align-items-center mb-2">
                      <label htmlFor="question" className="col-form-label">
                        Subtitle:
                      </label>
                      <div className="d-flex flex-grow-1 mx-2">
                        <input 
                          type="text"
                          className="form-control mx-2"
                          id="formQuestion" 
                          value={title.subTitle[index].subTitleLabel}
                          onChange={(e) => this.handleSubTitleLabel(index, e.target.value)}
                        />
                      
                      {/* {validationErrors.question && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.question}
                        </div>
                      )} */}
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
                
                
              {this.state.title.subTitle[index].nestedTitle.map((nestedTitleElem, index_nest) => (
              <ul>
                <li>
                  {/* Title 2 */}
                  <div className="mb-3 d-flex align-items-center mb-2">
                    <label htmlFor="question" className="col-form-label">
                      Nested Title:
                    </label>
                    <div className="d-flex flex-grow-1 mx-2">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="formQuestion" 
                        value={this.state.questionList.question}
                        onChange={(e) => this.handleNestedTitleLabel(index, index_nest, e.target.value)}
                      />
                    </div>
                    {validationErrors.question && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.question}
                      </div>
                    )}
                  </div>

                  {/* Add nestedTitle */}
                  <div className="d-flex align-items-center">
                  <button className="btn btn-outline-dark" onClick={this.addNestedTitle}>
                    Add nested title
                  </button>
                  </div>

                </li>

              </ul>
              ))}

            </ul>
            ))}

            {/* Add subTitle */}
            <div className="d-flex align-items-center">
                  <button className="btn btn-outline-dark" onClick={this.addSubTitle}>
                    Add subtitle
                  </button>
                  {/* {this.state.title.subTitle.length > 0 && (
                    <button 
                    className="btn btn-outline-danger ms-2" 
                    // onClick={clearSelections}
                    >
                      Clear subtitle
                    </button>
                  )} */}
                </div>
              
              {/* Options Type */}
              {/* <div className="mb-3">
                <label htmlFor="optionsType" className="col-form-label">
                  Options Types:
                </label>
                <select
                  className="form-select"
                  id="formOptionsType"
                  value={this.state.questionList.optionType}
                  onChange={this.handleQuestionOptionType}
                >
                  <option value="multipleChoice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="linear">Linear Scale</option>
                  <option value="multipleChoiceGrid">Multiple Choice Grid</option>
                  <option value="checkboxGrid">Checkbox Grid</option>
                  <option value="openEnded">Open-Ended</option>
                </select>
                {validationErrors.optionType && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.optionType}
                  </div>
                )}
              </div> */}
            
              
            </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            
            <div className="form-check form-switch form-check-inline">
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="firstQuestion"
                      checked={this.state.questionList.firstQuestion}
                      onChange={this.toggleFirstQuestion}
                    />
                    <label className="form-check-label" htmlFor="firstQuestionCheck">
                      First Question
                    </label> */}
              </div>
            <button type="button" className="btn btn-dark" onClick={this.handleSubmit}>
            Submit
            </button>
          </div>
        </Modal.Footer>
        </Modal>

        {this.renderToast()}

        <div 
          className="modal fade" 
          id={`editQuestion`}
          tabIndex="-1" 
          aria-labelledby="editQuestionLabel" 
          aria-hidden="true" 
        >
        </div>
      </div>
    );
  }
}

export default CreateTitle;