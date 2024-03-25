import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Modal } from 'bootstrap';
import './createQuestion.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CreateTitle from './createTitle';
import FirstQuestionModal from './firstQuestionModal';

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
      previousQuestion: '',
      nextQuestion: '',
      selectedOption: 'multipleChoice',
      options: [{ text: '', isCorrect: false, marks: '' }],
      gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column 1', value: 'Column 1' }], answers: [] },
      openEndedText: '',
      openEndedWordLimit: 500,
      openEndedWordCount: 0,
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
      country: {
        selectedCountry: '',
        countryFirstQuestion: false
      },
      isLeadingQuestion: false,
      showExplanation: false,
      showToast: false,
      minScale: 1,
      maxScale: 5,
      validationErrors: {
        title: '',
        question: '',
        optionType: '',
        options: '',
        openEnded: '',
        marks: '',
        country: '',
        explanation: '',
        countryFirstQuestion: '',
      },
      requireResponse: false,
      allQuestions: [],
      allTitles:[],
      selectedTitle: '',
      selectedTitleLabel: '',
      selectedTitleQuestions: [],
      firstQuestionId: '',
      firstQuestionValue: '',
      firstQuestionRender: false,
      countryFirstQuestionId: '',
      countryFirstQuestionValue: '',
      countryFirstQuestionRender: false,
      nestedTitle: {
        id: '',
        firstQuestion: false
      },
      nestedTitleLabel: '',
      showMarks: true,
      showFirstQuestionNestedTitleOption: false,
      nestedTitleFirstQuestionRender: false,
      nestedTitleFirstQuestionId: '',
      nestedTitleFirstQuestionValue: ''
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
        this.fetchTitles();
    });
    createQuestionModal.addEventListener('hidden.bs.modal', () => {
        this.resetState();
    });
    this.fetchQuestions();
    this.fetchTitles();
  };

  componentDidUpdate(prevProps) {
    if (this.props.questionsChanged !== prevProps.questionsChanged) {
      this.fetchQuestions();
      this.fetchTitles();
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

  fetchTitles = async () => {
    try {
      const response = await fetch(`http://${destination}/api/displayTitles`);
      const titles = await response.json();
      this.setState({ allTitles: titles });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  componentWillUnmount() {
    const createQuestionModal = document.getElementById('createQuestion');
    createQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  };

  updateCountryFirstQuestion = () => {
    console.log(`prop updateCountryFirstQuestion executed.`)
    
    const { allQuestions, countryFirstQuestionId } = this.state;
    const updatedQuestions = allQuestions.map(question => {
      if (question._id === countryFirstQuestionId) {
        console.log(`question._id === countryFirstQuestionId`)
        return { 
          ...question,
          country: {
            ...question.country,
            countryFirstQuestion: false,
          },
        };
      } else {
        return question;
      }
    });
    this.setState({ allQuestions: updatedQuestions });

    // Reset state value to false and update toggle to TRUE
    this.setState({ 
      countryFirstQuestionRender: false,
      country: {
        ...this.country,
        countryFirstQuestion: true,
      },
     });
  };

  updateNestedTitleFirstQuestion = () => {
    console.log(`prop updateNestedTitleFirstQuestion executed.`)
    
    const { allQuestions, nestedTitleFirstQuestionId } = this.state;
    const updatedQuestions = allQuestions.map(question => {
      if (question._id === nestedTitleFirstQuestionId) {
        console.log(`question._id === nestedTitleFirstQuestionId`)
        return { 
          ...question,
          nestedTitle: {
            ...question.nestedTitle,
            firstQuestion: false,
          },
        };
      } else {
        return question;
      }
    });
    this.setState({ allQuestions: updatedQuestions });

    // Reset state value to false and update toggle to TRUE
    this.setState({ 
      nestedTitleFirstQuestionRender: false,
      nestedTitle: {
        ...this.nestedTitle,
        firstQuestion: true
      },
     });
  };
  
  firstQuestionModalOnHide = () => {
    this.setState( {
      countryFirstQuestionRender: false,
      nestedTitleFirstQuestionRender: false
    })
  };

  handleTitleSelect = (e) => {
    const { allQuestions } = this.state;
    let valueArray = e.split(",");

    let titleQuestionsArray = [];
    for (let i=0; i<allQuestions.length; i++) {
      if (valueArray[0] === allQuestions[i].titleId) {
        titleQuestionsArray.push(allQuestions[i])
        // console.log(`matching Qs: ${allQuestions[i].question}`)
      };
    };
    // console.log(`matching Qs Id: ${titleQuestionsArray}`)

    this.handleFirstQuestionNestedTitleOption(e);

    this.setState({ 
      selectedTitle: valueArray[0],
      selectedTitleLabel: e,
      selectedTitleQuestions: titleQuestionsArray
    });
    // }, console.log(`selectedTitle: ${valueArray[0]} and ${valueArray[1]}`));
  };

  fetchNestedTitles = () => {
    const { allTitles } = this.state;

    // Determine nested titles
    let nestedTitlesArray = [];
    // loops through main titles
    for (let i=0; i<allTitles.length; i++) {      
      // loops through subtitles
      for (let j=0; j<allTitles[i].title.subTitle.length; j++) {
        // loops through nested titles
        for (let k=0; k<allTitles[i].title.subTitle[j].nestedTitle.length; k++) {
          // console.log(`nestedTitles label: ${allTitles[i].title.subTitle[j].nestedTitle[k].nestedTitleLabel}`)
          nestedTitlesArray.push({nestedTitleLabel: allTitles[i].title.subTitle[j].nestedTitle[k].nestedTitleLabel, id: allTitles[i].title.subTitle[j].nestedTitle[k]._id});
        };
      };
    };
    return nestedTitlesArray;
  };

  handleFirstQuestionNestedTitleOption = (e) => {
    let valueArray = e.split(",");
    let nestedTitlesArray = this.fetchNestedTitles();

    // Determine a match for nested title with the selected title
    for (let i=0; i<nestedTitlesArray.length; i++) {
      if (valueArray[0] === nestedTitlesArray[i].id) {
        // console.log(`match: ${nestedTitlesArray[i].nestedTitleLabel}`)
        this.setState({ 
          showFirstQuestionNestedTitleOption: true,
          nestedTitle: {
            ...this.nestedTitle,
            id: valueArray[0],
            firstQuestion: false
          },
          nestedTitleLabel: nestedTitlesArray[i].nestedTitleLabel
         });
        return;
      } else {
        this.setState({ showFirstQuestionNestedTitleOption: false })
      }
    };
  };

  toggleFirstQuestionNestedTitle = () => {
    
    // Validate whether nested title first question is vacant or not
    const { 
      isNestedTitleFirstQuestionVacant,
    } = this.validateFirstQuestionNestedTitle();
    
    if (isNestedTitleFirstQuestionVacant === true) {
      this.setState(prevState => ({
        nestedTitle: {
          ...prevState.nestedTitle,
          firstQuestion: !prevState.nestedTitle.firstQuestion
        }
      }));
      console.log(`is vacant`)
    } else {
      // render the firstQuestionModal here
      console.log(`is taken`)
      this.setState({ nestedTitleFirstQuestionRender: true });
    }
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
    this.setState(prevState => {
      const updatedRow = prevState.gridOptions.row.filter((_, idx) => idx !== index);
      const updatedAnswers = prevState.gridOptions.answers.filter(answer => answer.rowIndex !== index);
      
      // Update the indices of rows greater than the deleted row
      const updatedAnswersWithAdjustedRowIndices = updatedAnswers.map(answer => {
        if (answer.rowIndex > index) {
          return {
            ...answer,
            rowIndex: answer.rowIndex - 1
          };
        }
        return answer;
      });
  
      return {
        gridOptions: {
          ...prevState.gridOptions,
          row: updatedRow,
          answers: updatedAnswersWithAdjustedRowIndices
        }
      };
    });
  };
  
  deleteGridColumn = (index) => {
    this.setState(prevState => {
      const updatedColumn = prevState.gridOptions.column.filter((_, idx) => idx !== index);
      const updatedAnswers = prevState.gridOptions.answers.filter(answer => answer.columnIndex !== index);
      
      // Update the indices of columns greater than the deleted column
      const updatedAnswersWithAdjustedColumnIndices = updatedAnswers.map(answer => {
        if (answer.columnIndex > index) {
          return {
            ...answer,
            columnIndex: answer.columnIndex - 1
          };
        }
        return answer;
      });
  
      return {
        gridOptions: {
          ...prevState.gridOptions,
          column: updatedColumn,
          answers: updatedAnswersWithAdjustedColumnIndices
        }
      };
    });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleOptionChange = (index, value) => {
    const { options } = this.state;
    this.setState({
      options: options.map((option, i) =>
      i === index ? { ...option, text: value } : option
      )    
    }) 
  };

  handleMarksChange = (index, value) => {
    const { options } = this.state;
    this.setState({
      options: options.map((option, i) =>
        i === index ? { ...option, marks: value } : option
      )    
    }); 
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

  handleOpenEndedText = (e) => {
    this.setState( () => ({
      openEndedText: e.target.value,
      openEndedWordCount: this.getWordCount(e.target.value), // Update word count on change
    }),
    () => {
      localStorage.setItem("openEndedText", JSON.stringify(this.state.openEndedText))
    })
  };

  getWordCount = (text) => {
    // Split the text by whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
  };

  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions, requireResponse, isLeadingQuestion, allQuestions, openEndedText, openEndedWordCount, openEndedWordLimit, validationErrors } = this.state;
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
                  {selectedOption === 'multipleChoice' && isLeadingQuestion && (
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
              {selectedOption === 'multipleChoice' && isLeadingQuestion && (
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
        this.safeCheckMultipleChoice();
        /* falls through */
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
        
        case "openEnded":
          return (
            <>
  
              <label htmlFor="question" className="col-form-label">
                Content:
              </label>
              <div>
                <InputGroup>
                  <Form.Control 
                    id="formOpenEnded"
                    as="textarea" 
                    aria-label="With textarea"
                    value={openEndedText}
                    onChange={this.handleOpenEndedText}
                  />
                </InputGroup>
                <p
                  style={{ color: openEndedWordCount > openEndedWordLimit ? 'red' : 'inherit' }} // Set color based on condition
                >
                  Words: {openEndedWordCount}/{openEndedWordLimit}
                </p>
                {validationErrors.openEnded && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {validationErrors.openEnded}
                    </div>
                  )}
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

  validateCountryFirstQuestion = () => {
    const { allQuestions, country } = this.state;

    for (let i=0; i < allQuestions.length; i++){
      // Case: same country AND first question exists
      if (
        country.selectedCountry === allQuestions[i].country.selectedCountry && 
        allQuestions[i].country.countryFirstQuestion === true
      ) {
          console.log(`A first question already exists: ${allQuestions[i].country.selectedCountry}`)
          this.setState({
            countryFirstQuestionId: allQuestions[i]._id,
            countryFirstQuestionValue: allQuestions[i].question
          });
        return { 
          exists: true, 
          id: allQuestions[i]._id, 
          value: allQuestions[i].question, 
          countryValue: allQuestions[i].country.selectedCountry, 
          countryFirstQuestionBoolean: allQuestions[i].country.countryFirstQuestion
        };
      } else {
        console.log(`A country first question is vacant`)
      }
    };
    return { exists: false, id: null, value: null };
  };

  toggleCountryFirstQuestion = () => {
    const { country } = this.state;
    // Reset state on each function call
    this.setState({
      validationErrors: {
        countryFirstQuestion: true
      }
    });

    if (country.selectedCountry === '') {
      console.log(`Select a country`)
      this.setState({
        validationErrors: {
          countryFirstQuestion: false ? '' : `Select a country first`
        }
      });
      // exit function
      return;
    };

    // When country.selectedCountry has been selected
    const { 
      exists,
      id, 
      value,
      countryValue,
      countryFirstQuestionBoolean
    } = this.validateCountryFirstQuestion();

    // Case: same country AND first question vacant
    if (country.selectedCountry === countryValue && countryFirstQuestionBoolean === false) {
      this.setState(prevState => ({
        country: {
          ...prevState.country,
          countryFirstQuestion: !prevState.country.countryFirstQuestion
        }
      }));
    }
    // Case: same country AND first question exists AND toggle is currently set FALSE
    // this way when editing THE first question, the toggle may be turned from TRUE to FALSE without executing this validation 
    else if (
      country.selectedCountry === countryValue && 
      countryFirstQuestionBoolean === true && 
      country.countryFirstQuestion === false
    ) {
      console.log(`A country first question already exists: ${id}-${value}-${countryValue}`)
      this.setState({
        countryFirstQuestionId: id,
        countryFirstQuestionValue: value,
        countryFirstQuestionRender: exists
      });
    }
    // Case: different country
    else if (country.selectedCountry !== countryValue) {
      console.log(`A country first question is vacant`)
      this.setState(prevState => ({
        country: {
          ...prevState.country,
          countryFirstQuestion: !prevState.country.countryFirstQuestion
        }
      }));
    };
  };

  renderCountryFirstQuestionModal = () => {
    const { 
      countryFirstQuestionId, 
      countryFirstQuestionValue,
      country
     } = this.state;
    // console.log(`render values: ${id},${value}`);
    return (
      <>
        <FirstQuestionModal
          openFirstQuestionModal = {true}
          type = {"country"}
          country = { country.selectedCountry }
          firstQuestionId = {countryFirstQuestionId}
          firstQuestionValue = {countryFirstQuestionValue}
          updateFirstQuestion = {this.updateCountryFirstQuestion}
          firstQuestionModalOnHide = {this.firstQuestionModalOnHide}
        />
      </>
    );
  };

  renderNestedTitleFirstQuestionModal = () => {
    const { 
      nestedTitle, 
      nestedTitleLabel, 
      nestedTitleFirstQuestionId, 
      nestedTitleFirstQuestionValue
    } = this.state;
    return (
      <>
        <FirstQuestionModal
          openFirstQuestionModal = {true}
          type = {"nestedTitle"}
          firstQuestionId = {nestedTitleFirstQuestionId}
          firstQuestionValue = {nestedTitleFirstQuestionValue}
          nestedTitleId = {nestedTitle.id}
          nestedTitleLabel = {nestedTitleLabel}
          updateFirstQuestion = {this.updateNestedTitleFirstQuestion}
          firstQuestionModalOnHide = {this.firstQuestionModalOnHide}
        />
      </>
    );
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
    if (selectedOption === 'checkbox') {
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
        gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true, marks: '' });
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
      gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true, marks: ''  });
      this.setState( { gridOptions } );
    }
  };
  
  handleCountryChange = (e) => {
    this.setState( (prevState) => ({
      country: { 
        ...prevState.country, 
        selectedCountry: e.target.value, 
        countryFirstQuestion: false 
      }
    }));
  };

  validateTitleSelect = () => {
    const { selectedTitle } = this.state;
    if (
      selectedTitle.trim() === '' || 
      selectedTitle.trim() === 'Select Title'
      ) {
        return false
    } else {
      return true
    };
  };

  validateFirstQuestionNestedTitle = () => {
    const { allQuestions, nestedTitle } = this.state;

    // Case: when nested title IS NOT selected, 
    // is not possible as only way to execute this function is when a 
    // nested title is currently selected

    for (let i=0; i<allQuestions.length; i++) {
      
      // Case: same nested title AND first question is false
      if (
        nestedTitle.id === allQuestions[i].nestedTitle.id && 
        allQuestions[i].nestedTitle.firstQuestion === false
      ) {
        return {
          isNestedTitleFirstQuestionVacant: true,
          nestedTitleId: ''
        };
      }

      // Case: same nested title AND first question is true
      else if (
        nestedTitle.id === allQuestions[i].nestedTitle.id && 
        allQuestions[i].nestedTitle.firstQuestion === true
      ) {
        // record the matched question
        this.setState({
          nestedTitleFirstQuestionId: allQuestions[i]._id,
          nestedTitleFirstQuestionValue: allQuestions[i].question
        })
        return {
          isNestedTitleFirstQuestionVacant: false,
          nestedTitleId: allQuestions[i].nestedTitle.id
        };
      }
    }

    // Case: nestedTitle.id doesn't match with any in the nestedTitle object array
    // return vacant status
    return {
      isNestedTitleFirstQuestionVacant: true,
      nestedTitleId: ''
    };
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
    if (selectedOption === 'linear' || selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid' || selectedOption === 'openEnded') {
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

  validateOpenEnded = () => {
    const { openEndedWordCount, openEndedWordLimit, selectedOption } = this.state;

    if (selectedOption === 'openEnded') {
      // code below
      if (openEndedWordCount > openEndedWordLimit) {
        // case when openEndedWordCount GREATER THAN openEndedWordLimit
        return false;
      } else {
        // case when openEndedWordCount LESS THAN OR EQUALS openEndedWordLimit
        return true;
      }
    } else {
      return true;
    }
  };
  
  validateMarks = () => {
    const { selectedOption, options, isLeadingQuestion, showMarks, gridOptions } = this.state;
  
    // Case: when marks is not required, then validation for marks not required
    if (!showMarks) {
      return true;
    }
    
    // Case: when optionType is multipleChoice OR dropdown
    if (selectedOption === "multipleChoice" || selectedOption === "dropdown") {
      
      const isValid = () => {
        return options.some(option => {
          // Ensure option is defined and marks property exists
          if (option && option.marks !== undefined) {
            const marks = option.marks;
            return marks.trim() !== '' && !isNaN(parseInt(marks));
          }
          return false; // If option or marks property is undefined
        });
      };
      
      // Case: when isValid is false OR undefined: all options did not have marks assigned
      if (isValid() === false || isValid() === undefined) {
        return false;
      }
    
      console.log(`validateMarks: ${isValid()}`);
      // If all options pass validation or it's a leading question, return true
      return isLeadingQuestion || isValid();
    }

    else if (selectedOption === "checkbox") {
      console.log("validateMarks: checkbox");
      // Use every to check validation for each option
      const isValid = () => {
        let count = 0;
        options.every(option => {
          // Ensure option is defined and marks property exists
          if (option.marks !== undefined && option.isCorrect === true) {
              console.log(`option select: ${option.text}`);  
              count++;
              const marks = option.marks;
              console.log("count increment");
              return marks.trim() !== '' && !isNaN(parseInt(marks));
          }
          return true; // Return true to continue checking other options
        });
        // If count equals the number of correct options, return true
        const isCorrectElems = options.filter(option => option.isCorrect).length
        console.log(`isCorrectElems: ${isCorrectElems}`);
        return count === isCorrectElems;
      };

      console.log(`isValid: ${isValid()}`);

      // If all options pass validation or it's a leading question, return true
      return isLeadingQuestion || isValid();
    }

    // Case: when optionType is multipleChoiceGrid OR checkboxGrid
    else if (selectedOption === "multipleChoiceGrid" || selectedOption === "checkboxGrid") {
      console.log("validateMarks: grid");
      // Use every to check validation for each option
      const isValid = gridOptions.answers.every(answer => {
        // Ensure option is defined and marks property exists
        if (answer && answer.marks !== undefined) {
          const marks = answer.marks;
          return marks.trim() !== '' && !isNaN(parseInt(marks));
        }
        return false; // Return false if option is undefined or marks is undefined
      });
      // If all options pass validation or it's a leading question, return true
      return isLeadingQuestion || isValid;
    }
  };

  validateCountry = () => {
    const { country, showCountry } = this.state;
    // Case: when "Specific Country" is switched on
    if (showCountry) {
      // Case: when a selectedCountry has been set
      if (country.selectedCountry) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
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

    const isTitleSelectValid = this.validateTitleSelect();
    const isQuestionValid = this.validateQuestion();
    const isOptionTypeValid = this.validateOptionType();
    const isOptionsValid = this.validateOptions();
    const isOpenEndedValid = this.validateOpenEnded();
    const isMarksValid = this.validateMarks();
    const isCountryValid = this.validateCountry();
    const isExplanationValid = this.validateExplanation();
    const isGridValid = this.validateGrid();

    this.setState({
      validationErrors: {
        title: isTitleSelectValid ? '' : 'Select a title',
        question: isQuestionValid ? '' : 'Enter the question',
        optionType: isOptionTypeValid ? '' : 'Select an option type',
        grid: isGridValid ? '' : 'Complete all grid data entry and ensure there is one selection per row',
        options: isOptionsValid ? '' : 'Add at least two options and at least one selection',
        openEnded: isOpenEndedValid  ? '' : 'Ensure entry is less than the word limit',
        marks: isMarksValid ? '' : 'Enter the marks for all options',
        country: isCountryValid ? '' : 'Select at least one country',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
      },
    });

    if (
      !isTitleSelectValid || 
      !isQuestionValid || 
      !isOptionTypeValid || 
      !isOptionsValid || 
      !isGridValid || 
      !isOpenEndedValid || 
      !isMarksValid || 
      !isCountryValid || 
      !isExplanationValid 
      ) {
      return;
    }

    const {
      selectedTitle,
      question,
      selectedOption,
      options,
      gridOptions,
      minScale,
      maxScale,
      isLeadingQuestion,
      marks,
      country,
      showCountry,
      selectedCountry,
      explanation,
      showExplanation,
      requireResponse,
      previousQuestion,
      nextQuestion,
      showFirstQuestionNestedTitleOption,
      nestedTitle
    } = this.state;

    const dataToInsert = {
      titleId: selectedTitle,
      question,
      options: options,
      optionType: selectedOption,
      openEndedText: this.state.openEndedText,
      marks: isLeadingQuestion ? undefined : parseFloat(marks),
      country: country,
      explanation: showExplanation ? explanation : undefined,
      isLeadingQuestion,
      showCountry,
      requireResponse,
      previousQuestion: isLeadingQuestion ? undefined : previousQuestion,
      nextQuestion: isLeadingQuestion ? undefined : nextQuestion,
    };

    if (selectedOption === 'dropdown') {
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

    if (showFirstQuestionNestedTitleOption === true) {
      dataToInsert.nestedTitle = nestedTitle;
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
    const { allTitles, selectedTitle, selectedTitleQuestions, selectedOption, options, showCountry, countries, country, isLeadingQuestion, showExplanation, countryFirstQuestionRender, validationErrors, allQuestions, nextQuestion, previousQuestion, showMarks, gridOptions, showFirstQuestionNestedTitleOption, nestedTitle, nestedTitleFirstQuestionRender } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';
    const showNextQuestion = (isLeadingQuestion && (selectedOption === 'checkbox' || selectedOption === 'linear' || selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid')) || !isLeadingQuestion;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
          <div className="container flex-nowrap p-3 w-75">
            <div className="d-inline-flex float-end p-2 gap-3">
              <a href="/landing" className="btn btn-dark d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createQuestion">
                Create Question
              </a>
              <CreateTitle/>
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
                {/* Select title dropdown */}
                <div className="mb-3">
                      <label className="col-form-label">
                          Select a title to insert into:
                      </label>
                        <div className="d-flex align-items-left">
                          <div className="d-flex flex-grow-1">
                          <select
                            className="form-select"
                            style={{ flex: '1' }}
                            value={this.state.selectedTitleLabel}
                            onChange={(e) => this.handleTitleSelect(e.target.value)}
                          >
                            <option value="">Select Title</option>
                            {/* title loop */}
                            {allTitles.map((titleObject) => (
                              <optgroup key={titleObject.title.titleLabel} label={titleObject.title.titleLabel}>
                                {/* Render subTitleLabel as options */}
                                {titleObject.title.subTitle.map((subTitleObject) => (
                                  <React.Fragment key={subTitleObject._id}>
                                    <option value={[subTitleObject._id, subTitleObject.subTitleLabel]}>
                                      {subTitleObject.subTitleLabel}
                                    </option>

                                    {/* Render nestedTitleLabel as options */}
                                    {subTitleObject.nestedTitle.map((nestedTitleObject) => (
                                      <option key={nestedTitleObject._id} value={[nestedTitleObject._id, nestedTitleObject.nestedTitleLabel]}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nestedTitleObject.nestedTitleLabel} {/* Add one more level of indentation for nestedTitleLabel */}
                                      </option>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          </div>
                        </div>
                    {validationErrors.title && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.title}
                      </div>
                    )}
                  </div>


                  {/* First Question Nested Title */}
                  {showFirstQuestionNestedTitleOption && (
                    <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="nestedTitleFirstQuestionCheck"
                      checked={nestedTitle.firstQuestion}
                      onChange={this.toggleFirstQuestionNestedTitle}
                    />
                    <label className="form-check-label" htmlFor="firstQuestionCheck">
                      Nested Title's First Question
                    </label>
                      {nestedTitleFirstQuestionRender && (
                        <div>
                          {this.renderNestedTitleFirstQuestionModal()}
                        </div>
                      )}
                    </div>
                  )}


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
                  
                  {/* Option Types */}
                  <div className="mb-3">
                    <label htmlFor="optionsType" className="col-form-label">
                      Options Types:
                    </label>
                    <select
                      className="form-select"
                      id="optionsType"
                      value={selectedOption}
                      onChange={
                        (e) => this.setState({ selectedOption: e.target.value }, () => {
                          if (e.target.value === 'linear' || e.target.value === 'openEnded'){
                            this.setState({ showMarks: false });
                          } else {
                            this.setState({ showMarks: true });
                          };
                        })
                      }
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
                  
                  {/* MARKS */}
                  {!isLeadingQuestion && showMarks && (
                  <div className="mb-3">
                    <label htmlFor="mark" className="col-form-label">
                      Marks:
                    </label>
                  </div>
                  )}
                  {/* Case: multiple choice and checkbox */}
                  {!isLeadingQuestion && showMarks && options.map((option, index) => (
                    // Check if the option is correct, and only render if it is
                    option.isCorrect && (
                      <div className="mb-3" key={index}>
                        <a>{option.text}</a>
                        <input
                          type="text"
                          className="form-control"
                          id="marks"
                          placeholder="Enter marks for this option"
                          value={option.marks}
                          onChange={(e) => this.handleMarksChange(index, e.target.value)}
                        />
                        
                      </div>
                    )
                  ))}
                  {/* Case: multiple choice grid and checkbox grid */}
                  {!isLeadingQuestion && showMarks && gridOptions.answers.map((selection, index) => (
                    // Check if the option is correct, and only render if it is
                    selection.isCorrect && (
                      <div className="mb-3" key={index}>
                        <a>{gridOptions.row[selection.rowIndex] ? gridOptions.row[selection.rowIndex].text : ''} / {gridOptions.column[selection.columnIndex] ? gridOptions.column[selection.columnIndex].text : ''}</a>
                        
                        <input
                          type="text"
                          className="form-control"
                          id="marks"
                          placeholder="Enter marks for this option"
                          value={selection.marks}
                          onChange={(e) => {
                            const { value } = e.target;
                            const updatedAnswers = gridOptions.answers.map((answer, i) => {
                              if (i === index) {
                                return { ...answer, marks: value };
                              }
                              return answer;
                            });
                          
                            this.setState(prevState => ({
                              gridOptions: {
                                ...prevState.gridOptions,
                                answers: updatedAnswers
                              }
                            }));
                          }}
                        />
                      </div>
                    )
                  ))}
                  {validationErrors.marks && (
                    <div style={{ color: 'red', fontSize: 12 }}>
                      {validationErrors.marks}
                    </div>
                  )}

                  {/* Specific Country */}
                  {showCountry && (
                    <div className="mb-3">
                      <label className="col-form-label">Country:</label>
                      <div style={{ maxHeight: '130px', overflowY: 'auto'}}>
                        {countries.map((country, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="radio"
                              id={country}
                              value={country}
                              checked={this.state.country.selectedCountry === country}
                              onChange={this.handleCountryChange}
                              className="form-check-input"
                              size={8}
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

                    {/* Country First Question */}
                    <p></p>
                    <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="countryFirstQuestionCheck"
                      checked={country.countryFirstQuestion}
                      onChange={this.toggleCountryFirstQuestion}
                    />
                    <label className="form-check-label" htmlFor="firstQuestionCheck">
                      First Question
                    </label>
                    {validationErrors.countryFirstQuestion && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.countryFirstQuestion}
                        </div>
                      )}
                      {countryFirstQuestionRender && (
                        <div>
                          {this.renderCountryFirstQuestionModal()}
                        </div>
                      )} 
                    </div>

                    </div>
                  )}
                  
                  {/* Previous Question */}
                  {showNextQuestion && selectedTitle && (
                    <div className="mb-3">
                      <label htmlFor="previousQuestion" className="col-form-label">Previous Question:</label>
                      <select
                        className="form-select"
                        id="previousQuestion"
                        value={previousQuestion}
                        onChange={(e) => this.setState({ previousQuestion: e.target.value })}
                      >
                        <option value="">Select Previous Question</option>
                        {selectedTitleQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    
                    {/* Next Question */}
                      <label htmlFor="nextQuestion" className="col-form-label">Next Question:</label>
                      <select
                        className="form-select"
                        id="nextQuestion"
                        value={nextQuestion}
                        onChange={(e) => this.setState({ nextQuestion: e.target.value })}
                      >
                        <option value="">Select Next Question</option>
                        {selectedTitleQuestions.map((question) => (
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