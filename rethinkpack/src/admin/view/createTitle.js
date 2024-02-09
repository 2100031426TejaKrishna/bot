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
      marks: '',
      explanation: '',
      nextQuestion: '',
      questionType: '',
      selectedOption: 'multipleChoice',
      options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false }],
      defaultLinearArray: [ { scale: 1, label: 'Strongly Disagree' }, { scale: 5, label: 'Strongly Agree' },  ],
      gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column 1', value: 'Column 1' }], answers: [] },
      showCountry: false,
      selectedCountries: [],
      isFirstQuestion: false,
      isLeadingQuestion: false,
      showExplanation: false,
      showToast: false,
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
    // Modal ref
    this.editQuestionModalRef = React.createRef();
    // bind API?
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
    // reset
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.addEventListener('hidden.bs.modal', this.resetState);
  }

  componentWillUnmount() {
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  }

/*----------- function helpers ----------------------*/

  handleQuestionTypeRadio = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, questionType: e.target.value }
    }))
  }

  handleQuestionText = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, question: e.target.value }
    }))
  }

  handleQuestionOptionType = (e) => {
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        optionType: e.target.value,
        // Condition check for linearScale array
        // If array is empty, set default array
        // If array is not empty, use fetched values
        linearScale:
          prevState.questionList.linearScale.length === 0
            ? this.state.defaultLinearArray
            : prevState.questionList.linearScale,
        // Condition check for openEnded field
        openEndedText:
          prevState.questionList.openEndedText === undefined
            ? ''
            : prevState.questionList.openEndedText
      }
    }));
  };

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

  addOption = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        options: [
          ...prevState.questionList.options,
          { text: "" , isCorrect: false }
        ]
      }
    }));
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      questionList: { ...prevState.questionList, options: prevState.questionList.options.filter((_, i) => i !== index) }
    }));
  };
  


  toggleFirstQuestion = () => {
    this.setState(prevState => ({
      questionList: { ...prevState.questionList, firstQuestion: !prevState.questionList.firstQuestion }
    }));
  };

  toggleLeadingQuestion = () => {
    this.setState(prevState => ({
      isLeadingQuestion: !prevState.isLeadingQuestion
    }));
  };

  toggleExplanation = () => {
    this.setState((prevState) => ({
      showExplanation: !prevState.showExplanation,
    }));
  };

  toggleRequireResponse = () => {
    this.setState(prevState => ({
      requireResponse: !prevState.requireResponse,
    }));
  };

  selectOptionsRadio = (index, value) => {
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        options: prevState.questionList.options.map((option, i) =>
          i === index ? { ...option, isCorrect: value } : {...option, isCorrect: false}
        ),
      },
    }));
  }

  toggleGridAnswer = (rowIndex, colIndex) => {
    const { questionList, gridOptions } = this.state;
  
    if (questionList.optionType === 'checkboxGrid') {
      const answerIndex = gridOptions.answers.findIndex(
        (answer) => answer.rowIndex === rowIndex && answer.columnIndex === colIndex
      );
    
      // If answer exists, delete it
      if (answerIndex > -1) {
        gridOptions.answers.splice(answerIndex, 1);
      } else {
        // If answer doesn't exist, add it
        gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true });
      }

      this.setState( { gridOptions } );
        
    } else if (questionList.optionType === 'multipleChoiceGrid') {
      // Find any existing answer for the same row and remove it
      const answerIndex = gridOptions.answers.findIndex(
        (answer) => answer.rowIndex === rowIndex
      );
      if (answerIndex > -1) {
        gridOptions.answers.splice(answerIndex, 1);
      }
  
      // Add the new answer with isCorrect set to true
      gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true });
  
      this.setState( { gridOptions } );
    }
  };
 
  toggleCorrectAnswer = (index) => {
    const { questionList } = this.state;
  
    if (questionList.optionType === 'checkbox') {
      this.setState(prevState => ({
        questionList: {
          ...prevState.questionList,
          options: prevState.questionList.options.map((option, i) => {
            if (i === index) {
              return { ...option, isCorrect: !option.isCorrect };
            }
            return option;
          })
        }
      }));
    } else if (questionList.optionType === 'dropdown') {
      this.setState(prevState => ({
        options: prevState.options.map((option, i) => ({
          ...option,
          isCorrect: i === index,
        })),
      }));
    } else if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      this.setState((prevState) => ({
        gridOptions: {
          ...prevState.gridOptions,
          column: prevState.gridOptions.columns.map((col, i) => {
            if (i === index) {
              return { ...col, isCorrect: !col.isCorrect };
            }
            return col;
          }),
        },
      }));
    }
  };

  handleCountryChange = (event) => {
    const { value } = event.target;
    this.setState((prevState) => {
      if (prevState.selectedCountries.includes(value)) {
        return {
          selectedCountries: prevState.selectedCountries.filter(
            (country) => country !== value
          ),
        };
      } else {
        return {
          selectedCountries: [...prevState.selectedCountries, value],
        };
      }
    });
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
  
  validateOptions = () => {
    const { questionList, isLeadingQuestion } = this.state;
    if (questionList.optionType === 'linear' || questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      return true;
    }

    // Check a minimum of one selection is made
    let minSelection = false;
    // If leading question, then selection is disabled,
    // hence cannot make minimum selection, 
    // so in the else statement (isLeadingQuestion is true)
    // make it so minSelection is set true
    if (!isLeadingQuestion) {
      for (let i=0; i<questionList.options.length; i++) {
        if (questionList.options[i].isCorrect) {
          return minSelection = true
        }
      }
    } else {
      minSelection = true
    }
    
    return questionList.options.length >= 2 && minSelection === true;
  };

  validateGrid = () => {
    
    const { questionList, gridOptions, isLeadingQuestion } = this.state;

    if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
        // Check a label has been assigned for each row
      for (let i=0; i<gridOptions.rows.length; i++) {
        if (gridOptions.rows[i].text === '') {
          return false
        }
      }
      // Check a label has been assigned for each column
      for (let i=0; i<gridOptions.columns.length; i++) {
        if (gridOptions.columns[i].text === '') {
          return false
        }
      }
      // Catch minimum number of answers is less than number of rows
      // Applies when NOT a leading question
      if (!isLeadingQuestion) {
        if (gridOptions.answers.length < gridOptions.rows.length) {
          return false
        } else {
          return true
        }
      }
    }
    return true;
  };

  
  validateMarks = () => {
    const { questionList, isLeadingQuestion } = this.state;
    return isLeadingQuestion || (questionList.marks !== '' && !isNaN(questionList.marks));
  };
  
  validateCountries = () => {
    const { selectedCountries, showCountry } = this.state;
    return !showCountry || (selectedCountries.length > 0);
  };
  
  validateExplanation = () => {
    const { explanation, showExplanation } = this.state;
    return !showExplanation || explanation.trim() !== '';
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

    const isQuestionTypeValid = this.validateQuestionType();
    const isQuestionValid = this.validateQuestion();
    const isOptionTypeValid = this.validateOptionType();
    const isOptionsValid = this.validateOptions();
    const isMarksValid = this.validateMarks();
    const isCountriesValid = this.validateCountries();
    const isExplanationValid = this.validateExplanation();
    const isGridValid = this.validateGrid();

    this.setState({
      validationErrors: {
        questionType: isQuestionTypeValid ? '' : 'Select one question type',
        question: isQuestionValid ? '' : 'Enter the question',
        optionType: isOptionTypeValid ? '' : 'Select an option type',
        grid: isGridValid ? '' : 'Complete all grid data entry and ensure there is one selection per row',
        options: isOptionsValid ? '' : 'Add at least two options and at least one selection',
        marks: isMarksValid ? '' : 'Enter the marks (an integer value) for this question',
        country: isCountriesValid ? '' : 'Select at least one country',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
      },
    });

    if (
      !isQuestionTypeValid || 
      !isQuestionValid || 
      !isOptionTypeValid || 
      !isGridValid || 
      !isOptionsValid || 
      !isMarksValid || 
      !isCountriesValid || 
      !isExplanationValid
    ) {
      return;
    }

    const {
      gridOptions,
      isLeadingQuestion,
      showCountry,
      selectedCountries,
      explanation,
      showExplanation,
      requireResponse,
      questionList,
      questionId
    } = this.state;

    const dataToUpdate = {
      questionType: this.state.questionList.questionType,
      question: this.state.questionList.question,
      optionType: this.state.questionList.optionType,
      options: this.state.questionList.options,
      grid: this.state.gridOptions,
      linearScale: this.state.questionList.linearScale,
      openEndedText: this.state.questionList.openEndedText,
      marks: isLeadingQuestion ? undefined : parseFloat(this.state.questionList.marks),
      explanation: showExplanation ? explanation : undefined,
      firstQuestion: this.state.questionList.firstQuestion,
      isLeadingQuestion,
      showCountry,
      requireResponse,
      nextQuestion: isLeadingQuestion ? undefined : this.state.questionList.nextQuestion
    };

    // Leading Question Marks check
    if (isLeadingQuestion === true) {
      // Case when isLeadingQuestion is true, set marks to null
      dataToUpdate.marks = null
    }

    // Case: multiple choce / checkbox / dropdown
    if (questionList.optionType === 'multipleChoice' || questionList.optionType === 'checkbox' || questionList.optionType === 'dropdown') {
      dataToUpdate.options = questionList.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect || false,
        optionsNextQuestion: (isLeadingQuestion) ? option.optionsNextQuestion : null 
      }));
    }
  
    if (questionList.optionType === 'linear') {
      dataToUpdate.linearScale = questionList.linearScale.map((option) => ({
        scale: option.scale,
        label: option.label
      }));
    } else {
      // clear linearScale
      dataToUpdate.linearScale = []
    }

    if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      dataToUpdate.grid = {
        rows: gridOptions.rows.map(rows => ({ text: rows.text })),
        columns: gridOptions.columns.map(columns => ({ text: columns.text })),
        answers: gridOptions.answers.filter(answer => answer.isCorrect)
      };
    } else {
      // clear grid
      dataToUpdate.grid = { rows: [], columns: [], answers: [] }
    }
    
    // Update database server API
    this.updateQuestion(questionId, dataToUpdate)
  };

/*---------------------RENDER----------------------------------*/

  render() {

    const { showCountry, isLeadingQuestion, showExplanation, validationErrors, questionId, questionIndex, allQuestions } = this.state;
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
          onHide={() => this.setState({ showModal: false })}
          className="modal-lg"
          ref={this.editQuestionModalRef}
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
                    value={this.state.questionList.question}
                    onChange={this.handleQuestionText}
                  />
                </div>
                {validationErrors.question && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.question}
                  </div>
                )}
              </div>

              <ul>
                <li>
                  {/* Title 1 */}
                  <div className="mb-3">
                    <label htmlFor="question" className="col-form-label">
                      Subtitle:
                    </label>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="formQuestion" 
                        value={this.state.questionList.question}
                        onChange={this.handleQuestionText}
                      />
                    </div>
                    {validationErrors.question && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.question}
                      </div>
                    )}
                  </div>
                  {/* Add options */}
                  <div className="d-flex align-items-center">
                  <button className="btn btn-outline-dark" onClick={this.addOption}>
                    Add subtitle
                  </button>
                  {this.state.title.subTitle.length > 0 && (
                    <button 
                    className="btn btn-outline-danger ms-2" 
                    // onClick={clearSelections}
                    >
                      Clear subtitle
                    </button>
                  )}
                  </div>

                </li>
                <ul>
                  <li>
                    {/* Title 2 */}
                    <div className="mb-3">
                      <label htmlFor="question" className="col-form-label">
                        Nested Title:
                      </label>
                      <div>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="formQuestion" 
                          value={this.state.questionList.question}
                          onChange={this.handleQuestionText}
                        />
                      </div>
                      {validationErrors.question && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.question}
                        </div>
                      )}
                    </div>

                    {/* Add options */}
                    <div className="d-flex align-items-center">
                    <button className="btn btn-outline-dark" onClick={this.addOption}>
                      Add nested title
                    </button>
                    {this.state.title.subTitle.length > 0 && (
                      <button 
                      className="btn btn-outline-danger ms-2" 
                      // onClick={clearSelections}
                      >
                        Clear nested title
                      </button>
                    )}
                    </div>

                  </li>

                </ul>

              </ul>
              
              

              


              {/* Question label */}
              {/* <div className="mb-3">
                <label htmlFor="question" className="col-form-label">
                  Question:
                </label>
                <div>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="formQuestion" 
                    value={this.state.questionList.question}
                    onChange={this.handleQuestionText}
                  />
                </div>
                {validationErrors.question && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.question}
                  </div>
                )}
              </div> */}

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
              
             
              

              {/* Marks */}
              {/* {!isLeadingQuestion && (
                <div className="mb-3">
                  <label htmlFor="mark" className="col-form-label">
                    Marks:
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="formMarks" 
                    value={this.state.questionList.marks}
                    onChange={this.handleQuestionMarks} 
                  />
                  {validationErrors.marks && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {validationErrors.marks}
                    </div>
                  )}
                </div>
              )} */}
              
              
              
              {/* Next Question */}
                  {!isLeadingQuestion && (
                    <div className="mb-3">
                      <label htmlFor="nextQuestion" className="col-form-label">Next Question:</label>
                      <select
                        className="form-select"
                        id="nextQuestion"
                        value={this.state.questionList.nextQuestion}
                        onChange={this.handleQuestionNextQuestion}
                      >
                        <option value="">Select Next Question</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
          ref={this.editQuestionModalRef}
        >
        </div>
      </div>
    );
  }
}

export default CreateTitle;