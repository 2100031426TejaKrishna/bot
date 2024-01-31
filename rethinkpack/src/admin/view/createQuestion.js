import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Modal } from 'bootstrap';
import './createQuestion.css';

// Switch URLs between Server and Local hosting here
// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      marks: '',
      explanation: '',
      nextQuestion: '',
      questionType: '',
      selectedOption: 'multipleChoice',
      options: [{ text: '', value: 'Option 1', isCorrect: false }],
      gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column 1', value: 'Column 1' }], answers: [] },
      showCountry: false,
      countries: [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
        "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
        "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
        "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
        "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
        "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus",
        "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
        "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
        "Finland", "France", "Gabon", "Gambia", "Georgia",
        "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
        "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
        "Hungary", "Iceland", "India", "Indonesia", "Iran",
        "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
        "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
        "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
        "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
        "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
        "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
        "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
        "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
        "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
        "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
        "Philippines", "Poland", "Portugal", "Qatar", "Romania",
        "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
        "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
        "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
        "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
        "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
        "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
        "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
        "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
        "Zambia", "Zimbabwe"
      ],
      selectedCountries: [],
      isLeadingQuestion: false,
      showExplanation: false,
      firstQuestion: false,
      showToast: false,
      minScale: 1,
      maxScale: 5,
      validationErrors: {
        questionType: '',
        question: '',
        optionType: '',
        options: '',
        marks: '',
        country: '',
        explanation: '',
      },
      requireResponse: false,
      allQuestions: []
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.createQuestionModalRef = React.createRef();
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast,
      options: 
      [ {
        text: '',
        value: '',
        isCorrect: false,
        nextQuestion: ''
      } ]
    })
  };
  
  componentDidMount() {
    const createQuestionModal = document.getElementById('createQuestion');
    createQuestionModal.addEventListener('shown.bs.modal', () => {
        this.resetState(); 
        this.fetchQuestions();
    });
    createQuestionModal.addEventListener('hidden.bs.modal', () => {
        this.resetState();
    });
    this.fetchQuestions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.questionsChanged !== prevProps.questionsChanged) {
      this.fetchQuestions();
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

  componentWillUnmount() {
    const createQuestionModal = document.getElementById('createQuestion');
    createQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  };

  addOption = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      options: [...prevState.options, { text: '', value: `Option ${prevState.options.length + 1}`, isCorrect: false, nextQuestion: '' }],
    }));
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      options: prevState.options.filter((_, i) => i !== index)
    }));
  };

  safeCheckMultipleChoice() {
    const { options } = this.state
    
    // check for more than one isCorrect truths, should only have one isCorrect truth for radio buttons
    let countIsCorrect = 0;
        
    for(let i=0; i<options.length; i++) {    
      if(options[i].isCorrect === true) {
        countIsCorrect ++
      }
    };

    // clear the selection if more than one answer exists
    if(countIsCorrect>1) {
      console.log(`countIsCorrect greater than 1`)
      this.setState((prevState) => ({
        options: prevState.options.map((option) => ({
          ...option,
          isCorrect: false, // Set isCorrect to false for each option
        })),
      }));
    }
  };

  safeCheckMultipleChoiceGrid() {
    const { gridOptions } = this.state;
    // For radio type, there is only one selection possible for each row
    // hence number of answers cannot be larger than the number of rows
    if (gridOptions.answers.length > gridOptions.row.length){
      this.setState(prevState => ({
        gridOptions: {
          ...prevState.gridOptions,
          answers: []
        }
      }));
    }
  };
  
  addGridRow = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        row: [
          ...prevState.gridOptions.row,
          { label: `Row ${prevState.gridOptions.row.length + 1}`, value: `Row ${prevState.gridOptions.row.length + 1}` }
        ]
      }
    }));
  };
  
  addGridColumn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => {
      return {
        gridOptions: {
          ...prevState.gridOptions,
          column: [
            ...prevState.gridOptions.column,
            { label: `Column ${prevState.gridOptions.column.length + 1}`, value: `Column ${prevState.gridOptions.column.length + 1}` }
          ]
        }
      };
    });
  };
  
  deleteGridRow = (index) => {
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        row: prevState.gridOptions.row.filter((_, idx) => idx !== index)
      }
    }));
  };
  
  deleteGridColumn = (index) => {
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        column: prevState.gridOptions.column.filter((_, idx) => idx !== index)
      }
    }));
  };

  handleInputChange = (e) => {
    if (e.target.id === "country") {
      const options = e.target.options;
      const selectedCountries = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedCountries.push(options[i].value);
        }
      }
      this.setState({ selectedCountries });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  handleOptionChange = (index, value) => {
    const { options } = this.state;
    this.setState({
      options: options.map((option, i) =>
      i === index ? { ...option, text: value } : option
      ),
    }) 
  };

  handleRowChange = (index, e) => {
    const newValue = e.target.value;
    this.setState(prevState => {
      const updatedRow = prevState.gridOptions.row.map((option, i) => {
        if (i === index) {
          return { ...option, text: newValue, value: newValue };
        }
        return option;
      });
      return {
        gridOptions: {
          ...prevState.gridOptions,
          row: updatedRow
        }
      };
    });
  };

  handleColumnChange = (index, e) => {
    const newValue = e.target.value;
    this.setState(prevState => {
      const updatedColumn = prevState.gridOptions.column.map((option, i) => {
        if (i === index) {
          return { ...option, text: newValue, value: newValue };
        }
        return option;
      });
      return {
        gridOptions: {
          ...prevState.gridOptions,
          column: updatedColumn
        }
      };
    });
  };

  handleNextQuestionChange = (index, nextQuestionId) => {
    this.setState(prevState => {
      const updatedOptions = prevState.options.map((option, i) => {
        if (i === index) {
          return { ...option, nextQuestion: nextQuestionId };
        }
        return option;
      });
  
      return { options: updatedOptions };
    });
  };

  clearNextQuestionSelection = () => {
    this.setState(prevState => ({
      options: prevState.options.map(option => ({
        ...option,
        nextQuestion: ''
      }))
    }));
  };

  clearGridSelections = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        answers: []
      }
    }));
  };

  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions, requireResponse, isLeadingQuestion, allQuestions, validationErrors } = this.state;
    const clearSelections = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedOptions = options.map((option) => ({
        ...option,
        isCorrect: false,
      }));
      this.setState({ options: clearedOptions });
    };

    // Check when changing from a populated checkboxGrid to multipleChoiceGrid
    if (selectedOption === 'multipleChoiceGrid') {
      this.safeCheckMultipleChoiceGrid();
    };
  
    switch (selectedOption) {
      case 'multipleChoice':
        this.safeCheckMultipleChoice();
        /* falls through */
      case 'checkbox':

        return (
          <>
            {options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type={selectedOption === 'multipleChoice' ? 'radio' : 'checkbox'}
                  className="form-check-input"
                  checked={option.isCorrect}
                  disabled={isLeadingQuestion}
                  onChange={
                    // Use specific onChange handler based on selectedOption,
                    // as radio buttons don't suit a toggle operation
                    selectedOption === 'multipleChoice' ? 
                      () => this.selectOptionsRadio(index, !option.isCorrect) : 
                      () => this.toggleCorrectAnswer(index)
                  }
                />
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    className="form-control mx-2"
                    value={this.state.options[index].text}
                    onChange={(e) => this.handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: '1' }}
                  />
                  {isLeadingQuestion && (
                    <select
                      className="form-select mx-2"
                      style={{ flex: '1' }}
                      value={option.nextQuestion}
                      onChange={(e) => this.handleNextQuestionChange(index, e.target.value)}
                    >
                      <option value="">Select Next Question</option>
                      {allQuestions.map((question) => (
                        <option key={question._id} value={question._id}>
                          {question.question}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {options.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteOption(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-dark" onClick={this.addOption}>
                Add option
              </button>
              {options.length > 0 && (
                <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                  Clear
                </button>
              )}
              {isLeadingQuestion && (
                <button className="btn btn-outline-danger ms-2" onClick={this.clearNextQuestionSelection}>
                  Clear Next Question
                </button>
              )}
            </div>
          </>
        );
  
      case 'linear':
        const minScale = this.state.minScale;
        const maxScale = this.state.maxScale;

        return (
          <div>
            <div className="mb-3 d-flex align-items-center">
              <select
                id="minScale"
                className="form-select me-2"
                value={minScale}
                onChange={(e) => this.setState({ minScale: parseInt(e.target.value) })}
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <span className="me-2">to</span>
              <select
                id="maxScale"
                className="form-select"
                value={maxScale}
                onChange={(e) => this.setState({ maxScale: parseInt(e.target.value) })}
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <option key={i} value={i + 2}>
                    {i + 2}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {[minScale, maxScale].map((scaleValue) => (
                <div key={scaleValue} className="d-flex align-items-center mb-2">
                  <span className="mr-2">{scaleValue} </span>
                  <input
                    type="text"
                    id={`scaleLabel${scaleValue}`}
                    className="form-control mx-2"
                    placeholder={`Labels (Optional)`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
  
      case 'dropdown':
        return (
          <>
            {options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  disabled={isLeadingQuestion}
                  checked={option.isCorrect}
                  onChange={() => this.toggleCorrectAnswer(index)}
                />
                <span className="mr-2">{index + 1}.</span>
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    className="form-control mx-2"
                    onChange={(e) => this.handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: '1' }}
                  />
                  {isLeadingQuestion && (
                    <select
                      className="form-select mx-2"
                      style={{ flex: '1' }}
                      value={option.nextQuestion}
                      onChange={(e) => this.handleNextQuestionChange(index, e.target.value)}
                    >
                      <option value="">Select Next Question</option>
                      {allQuestions.map((question) => (
                        <option key={question._id} value={question._id}>
                          {question.question}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {options.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteOption(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-dark" onClick={this.addOption}>
                Add option
              </button>
              {options.length > 0 && (
                <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                  Clear
                </button>
              )}
              {isLeadingQuestion && (
                <button className="btn btn-outline-danger ms-2" onClick={this.clearNextQuestionSelection}>
                  Clear Next Question
                </button>
              )}
            </div>
          </>
        );        
  
      case 'multipleChoiceGrid':
      case 'checkboxGrid':
        const isSingleRow = gridOptions.row.length === 1;
        return (
          <>
            <div className="scrollable-table-container">
            {validationErrors.grid && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.grid}
                  </div>
                )}
              <table>
                <thead>
                  <tr>
                    <th>Row/Column</th>
                    {gridOptions.column.map((col, colIndex) => (
                      <th key={colIndex} className="text-center">
                        <div className="d-flex justify-content-between align-items-center"> {}
                          <input
                              type="text"
                              className="form-control"
                              value={col.text}
                              onChange={(e) => this.handleColumnChange(colIndex, e)}
                              placeholder={`Column ${colIndex + 1}`}
                          />
                          {gridOptions.column.length > 1 && (
                            <div className="delete-column-btn">
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                type="button"
                                onClick={() => this.deleteGridColumn(colIndex)}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className={isSingleRow ? "last-column-no-space" : "last-column-space"}></th>
                  </tr>
                </thead>
                <tbody>
                  {gridOptions.row.map((row, rowIndex) => (
                    <tr key={rowIndex} className="grid-row-spacing">
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.text}
                          onChange={(e) => this.handleRowChange(rowIndex, e)}
                          placeholder={`Row ${rowIndex + 1}`}
                        />
                      </td>
                      {gridOptions.column.map((_, colIndex) => {
                        const isCorrect = gridOptions.answers.some(answer => answer.rowIndex === rowIndex && answer.columnIndex === colIndex && answer.isCorrect);
                        return (
                          <td key={colIndex}>
                            <input
                              type={selectedOption === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                              className="form-check-input"
                              name={`row-${rowIndex}`}
                              checked={isCorrect}
                              onChange={() => this.toggleGridAnswer(rowIndex, colIndex)}
                              disabled={isLeadingQuestion}
                            />
                          </td>
                        );
                      })}
                      <td className={isSingleRow ? "last-column-no-space" : "last-column-space"}>
                        {!isSingleRow && (
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            onClick={() => this.deleteGridRow(rowIndex)}
                          >
                            &times;
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-outline-dark" onClick={this.addGridRow}>
                Add Row
              </button>
              <button className="btn btn-outline-dark mx-2" onClick={this.addGridColumn}>
                Add Column
              </button>
              <button className="btn btn-outline-danger ms-2" onClick={this.clearGridSelections}>
                Clear
              </button>
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="requireResponseSwitch"
                  checked={requireResponse}
                  onChange={this.toggleRequireResponse}
                />
                <label className="form-check-label" htmlFor="requireResponseSwitch">
                  Require a response in each row
                </label>
              </div>
              </div>
          </>
        );    
  
      default:
        return null;
    }
  };  

  toggleCountryDropdown = () => {
    this.setState(prevState => ({
      showCountry: !prevState.showCountry
    }));
  };

  toggleLeadingQuestion = () => {
    this.setState(prevState => ({
      isLeadingQuestion: !prevState.isLeadingQuestion,
    }));
  };

  toggleExplanation = () => {
    this.setState((prevState) => ({
      showExplanation: !prevState.showExplanation,
    }));
  };

  toggleFirstQuestion = () => {
    this.setState(prevState => ({
      firstQuestion: !prevState.firstQuestion,
    }));
  };

  toggleRequireResponse = () => {
    this.setState(prevState => ({
      requireResponse: !prevState.requireResponse,
    }));
  };

  selectOptionsRadio = (index, value) => {
    this.setState((prevState) => ({
        options: prevState.options.map((option, i) =>
          i === index ? { ...option, isCorrect: value } : {...option, isCorrect: false}
        )  
    }));
  };

  toggleCorrectAnswer = (index) => {
    const { selectedOption  } = this.state;
    if (selectedOption === 'multipleChoice' || selectedOption === 'checkbox') {
      this.setState(prevState => ({
        options: prevState.options.map((option, i) => {
          if (i === index) {
            return { ...option, isCorrect: !option.isCorrect };
          }
          return option;
        })
      }));
    } else if (selectedOption === 'dropdown') {
      this.setState(prevState => ({
        options: prevState.options.map((option, i) => ({
          ...option,
          isCorrect: i === index,
        })),
      }));
    }
  };

  toggleGridAnswer = (rowIndex, colIndex) => {
    const { selectedOption, gridOptions } = this.state;
  
    if (selectedOption === 'checkboxGrid') {
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

    } else if (selectedOption === 'multipleChoiceGrid') {
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

  validateQuestionType = () => {
    const { questionType } = this.state;
    return questionType !== '';
  };
  
  validateQuestion = () => {
    const { question } = this.state;
    return question.trim() !== '';
  };
  
  validateOptionType = () => {
    const { selectedOption } = this.state;
    return selectedOption !== '';
  };
  
  validateOptions = () => {
    const { options, selectedOption, isLeadingQuestion } = this.state;
    if (selectedOption === 'linear' || selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid') {
      return true;
    }

    // Check a minimum of one selection is made
    let minSelection = false;
    // If leading question, then selection is disabled,
    // hence cannot make minimum selection, 
    // so in the else statement (isLeadingQuestion is true)
    // make it so minSelection is set true
    if (!isLeadingQuestion) {
      for (let i=0; i<options.length; i++) {
        if (options[i].isCorrect) {
          return minSelection = true
        }
      }
    } else {
      minSelection = true
    }
  
    return options.length >= 2 && minSelection === true;
  };

  validateGrid = () => {
    
    const { selectedOption, gridOptions, isLeadingQuestion } = this.state;

    if (selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid') {
        // Check a label has been assigned for each row
      for (let i=0; i<gridOptions.row.length; i++) {
        if (gridOptions.row[i].text === '') {
          return false
        }
      }
      // Check a label has been assigned for each column
      for (let i=0; i<gridOptions.column.length; i++) {
        if (gridOptions.column[i].text === '') {
          return false
        }
      }
      // Catch minimum number of answers is less than number of rows
      // Applies when NOT a leading question
      if (!isLeadingQuestion) {
        if (gridOptions.answers.length < gridOptions.row.length) {
          return false
        } else {
          return true
        }
      }
    }
    return true;
  };
  
  validateMarks = () => {
    const { marks, isLeadingQuestion } = this.state;
    return isLeadingQuestion || (marks.trim() !== '' && !isNaN(marks));
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
                Created new question successfully!
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
        marks: isMarksValid ? '' : 'Enter the marks for this question',
        country: isCountriesValid ? '' : 'Select at least one country',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
      },
    });

    if (!isQuestionTypeValid || !isQuestionValid || !isOptionTypeValid || !isOptionsValid || !isGridValid || !isMarksValid || !isCountriesValid || !isExplanationValid) {
      return;
    }

    const {
      questionType,
      question,
      selectedOption,
      options,
      gridOptions,
      minScale,
      maxScale,
      isLeadingQuestion,
      firstQuestion,
      marks,
      showCountry,
      selectedCountries,
      explanation,
      showExplanation,
      requireResponse,
      nextQuestion
    } = this.state;

    const dataToInsert = {
      questionType,
      question,
      options,
      optionType: selectedOption,
      marks: isLeadingQuestion ? undefined : parseFloat(marks),
      countries: showCountry ? selectedCountries : undefined,
      explanation: showExplanation ? explanation : undefined,
      isLeadingQuestion,
      showCountry,
      firstQuestion,
      requireResponse,
      nextQuestion: isLeadingQuestion ? undefined : nextQuestion
    };

    if (selectedOption === 'multipleChoice' || selectedOption === 'checkbox' || selectedOption === 'dropdown') {
      dataToInsert.options = options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect || false,
        optionsNextQuestion: isLeadingQuestion ? option.nextQuestion : undefined
      }));
    }
  
    if (selectedOption === 'linear') {
      dataToInsert.linearScale = [
        { scale: minScale, label: document.getElementById('scaleLabel' + minScale).value },
        { scale: maxScale, label: document.getElementById('scaleLabel' + maxScale).value },
      ];
    }

    if (selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid') {
      dataToInsert.grid = {
        rows: gridOptions.row.map(row => ({ text: row.label })),
        columns: gridOptions.column.map(column => ({ text: column.label })),
        answers: gridOptions.answers.filter(answer => answer.isCorrect)
      };
    }

    try {
      const response = await fetch(`http://${destination}/api/insertQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToInsert),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        console.log(dataToInsert);
        const modalInstance = Modal.getInstance(this.createQuestionModalRef.current);
        modalInstance.hide();
        this.createQuestionModalRef.current.addEventListener('hidden.bs.modal', () => {
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          document.body.style.overflow = '';
          document.body.classList.remove('modal-open');
          this.resetState();
        }, { once: true });
        this.props.onQuestionCreated();
        this.setState({ showToast: true });
        setTimeout(() => this.setState({ showToast: false }), 5000);
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
        console.error('Network error:', error);
    }
  };

  render() {
    const { questionType, selectedOption, showCountry, countries, selectedCountries, isLeadingQuestion, showExplanation, firstQuestion, validationErrors, allQuestions, nextQuestion } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';
    const showNextQuestion = (isLeadingQuestion && (selectedOption === 'linear' || selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid')) || !isLeadingQuestion;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
          <div className="container flex-nowrap p-3 w-75">
            <div className="d-inline-flex float-end p-2 gap-3">
              <a href="/landing" className="btn btn-dark d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createQuestion">
                Create Question
              </a>
              <a href="/landing" className="btn btn-dark d-md-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
        {this.renderToast()}
        <div className="modal fade" id="createQuestion" tabIndex="-1" aria-labelledby="createQuestionLabel" aria-hidden="true" ref={this.createQuestionModalRef}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="createQuestionLabel">
                  New Question
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                <div className="mb-3">
                    <div className="d-flex">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="questionType"
                          id="productInfoRadio"
                          value="productInfo"
                          checked={questionType === 'productInfo'}
                          onChange={() => this.setState({ questionType: 'productInfo' })}
                        />
                        <label className="form-check-label" htmlFor="productInfoRadio">
                          Product Information
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="questionType"
                          id="packagingInfoRadio"
                          value="packagingInfo"
                          checked={questionType === 'packagingInfo'}
                          onChange={() => this.setState({ questionType: 'packagingInfo' })}
                        />
                        <label className="form-check-label" htmlFor="packagingInfoRadio">
                          Packaging Information
                        </label>
                      </div>
                    </div>
                    {validationErrors.questionType && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.questionType}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="question" className="col-form-label">
                      Question:
                    </label>
                    <input type="text" className="form-control" id="question" value={this.state.question} onChange={this.handleInputChange} />
                    {validationErrors.question && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.question}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="optionsType" className="col-form-label">
                      Options Types:
                    </label>
                    <select
                      className="form-select"
                      id="optionsType"
                      value={selectedOption}
                      onChange={(e) => this.setState({ selectedOption: e.target.value })}
                    >
                      <option value="multipleChoice">Multiple Choice</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="linear">Linear Scale</option>
                      <option value="multipleChoiceGrid">Multiple Choice Grid</option>
                      <option value="checkboxGrid">Checkbox Grid</option>
                    </select>
                    {validationErrors.optionType && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.optionType}
                      </div>
                    )}
                  </div>
                  <div className="mb-3" id="optionsArea">
                    {this.renderOptionsArea()}
                    {validationErrors.options && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.options}
                      </div>
                    )}
                  </div>
                  {showExplanation && (
                    <div className="mb-3">
                      <label htmlFor="explanation" className="col-form-label">
                        {explanationLabel}:
                      </label>
                      <textarea className="form-control" id="explanation" value={this.state.explanation} onChange={this.handleInputChange}></textarea>
                      {validationErrors.explanation && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.explanation}
                        </div>
                      )}
                    </div>
                  )}
                  {!isLeadingQuestion && (
                    <div className="mb-3">
                      <label htmlFor="mark" className="col-form-label">
                        Marks:
                      </label>
                      <input type="text" className="form-control" id="marks" value={this.state.marks} onChange={this.handleInputChange} />
                      {validationErrors.marks && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.marks}
                        </div>
                      )}
                    </div>
                  )}
                  {showCountry && (
                    <div className="mb-3">
                      <label className="col-form-label">Country:</label>
                      <div style={{ maxHeight: '130px', overflowY: 'auto'}}>
                        {countries.map((country, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="checkbox"
                              id={country}
                              value={country}
                              checked={selectedCountries.includes(country)}
                              onChange={this.handleCountryChange}
                              className="form-check-input"
                              size={5}
                            />
                            <label htmlFor={country} className="form-check-label">
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                      {validationErrors.country && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.country}
                        </div>
                      )} 
                    </div>
                  )}
                  {showNextQuestion && (
                    <div className="mb-3">
                      <label htmlFor="nextQuestion" className="col-form-label">Next Question:</label>
                      <select
                        className="form-select"
                        id="nextQuestion"
                        value={nextQuestion}
                        onChange={(e) => this.setState({ nextQuestion: e.target.value })}
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
              </div>
              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="specific"
                        checked={showCountry}
                        onChange={this.toggleCountryDropdown}
                      />
                      <label className="form-check-label" htmlFor="specific">
                        Specific Country
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="leading"
                        checked={isLeadingQuestion}
                        onChange={this.toggleLeadingQuestion}
                      />
                      <label className="form-check-label" htmlFor="leading">
                        Leading Question
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="explanationCheck"
                        checked={showExplanation}
                        onChange={this.toggleExplanation}
                      />
                      <label className="form-check-label" htmlFor="explanationCheck">
                        {explanationLabel}
                      </label>
                    </div>
                  </div>
                  <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="firstQuestionCheck"
                      checked={firstQuestion}
                      onChange={this.toggleFirstQuestion}
                    />
                    <label className="form-check-label" htmlFor="firstQuestionCheck">
                      First Question
                    </label>
                  </div>
                  <button type="button" className="btn btn-dark" onClick={this.handleSubmit}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateQuestion;