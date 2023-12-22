import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Modal } from 'bootstrap';


class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      marks: '',
      explanation: '',
      nextQuestion: '',
      questionType: '',
      selectedOption: 'multipleChoice',
      options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false }],
      gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column A', value: 'Column A' }] },
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
      //
      testFirstQuestion: '',
      allQuestions: []
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.editQuestionModalRef = React.createRef();
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast 
    });
  }

  componentDidMount() {
    const editQuestionModal = document.getElementById('editQuestion');
    editQuestionModal.addEventListener('hidden.bs.modal', this.resetState);
  }


  /*--------------------------------*/

  
  fetchTestQuestion = async () => {
    try {
      
      console.log('Debug: fetchTestQuestion API call')

      const response = await fetch('http://localhost:5000/api/editReadUpdate');
      const questions = await response.json();
      this.setState({ testFirstQuestion: questions });

    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  

/*
  fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/displayQuestion');
      const questions = await response.json();
      this.setState({ allQuestions: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  */
  
  /*--------------------------------*/




  componentWillUnmount() {
    const editQuestionModal = document.getElementById('editQuestion');
    editQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  }

  addOption = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      options: [...prevState.options, { label: `Option ${prevState.options.length + 1}`, value: `Option ${prevState.options.length + 1}`, isCorrect: false }],
    }));
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      options: prevState.options.filter((_, i) => i !== index)
    }));
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
    
    //
    this.setState({ testFirstQuestion: e.target.value });
    
    
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
    const updatedOptions = options.map((option, i) => (
      i === index ? { ...option, label: value, value: value } : option
    ));
    this.setState({ options: updatedOptions });
  };

  handleRowChange = (index, e) => {
    const newValue = e.target.value;
    this.setState(prevState => {
      const updatedRow = prevState.gridOptions.row.map((option, i) => {
        if (i === index) {
          return { ...option, label: newValue, value: newValue };
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
          return { ...option, label: newValue, value: newValue };
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

  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions, requireResponse, isLeadingQuestion } = this.state;
    const clearSelections = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedOptions = options.map((option) => ({
        ...option,
        isCorrect: false,
      }));
      this.setState({ options: clearedOptions });
    };

    const clearGridSelections = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedGridOptions = {
        ...gridOptions,
        column: gridOptions.column.map((col) => ({
          ...col,
          isCorrect: false,
        })),
      };
      this.setState({ gridOptions: clearedGridOptions });
    };  
  
    switch (selectedOption) {
      case 'multipleChoice':
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
                  onChange={() => this.toggleCorrectAnswer(index)}
                />
                <input
                  type="text"
                  className="form-control mx-2"
                  onChange={(e) => this.handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
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
            <button className="btn btn-outline-dark" onClick={this.addOption}>
              Add option
            </button>
            {options.length > 0 && (
              <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                Clear
              </button>
            )}
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
                <input
                  type="text"
                  className="form-control mx-2"
                  onChange={(e) => this.handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
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
            <button className="btn btn-outline-dark" onClick={this.addOption}>
              Add Option
            </button>
            {options.length > 0 && (
              <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                Clear
              </button>
            )}
          </>
        );
  
      case 'multipleChoiceGrid':
      case 'checkboxGrid':
        const numberOfRows = Math.max(gridOptions.row.length, gridOptions.column.length);

        return (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Rows</th>
                  <th>Columns</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(numberOfRows)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      {gridOptions.row[index] && (
                        <div className="d-flex align-items-center">
                          <span className="row-number">{index + 1}.</span>
                          <input
                            type="text"
                            className="form-control mx-2"
                            onChange={(e) => this.handleRowChange(index, e)}
                            placeholder={`Row ${index + 1}`}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => this.deleteGridRow(index)}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      {gridOptions.column[index] && (
                        <div className="d-flex align-items-center">
                          <input
                            type={selectedOption === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                            className="form-check-input"
                            name={`column-${index}`}
                            checked={gridOptions.column[index].isCorrect}
                            onChange={() => this.toggleCorrectAnswer(index)}
                            disabled={isLeadingQuestion}
                          />
                          <input
                            type="text"
                            className="form-control mx-2"
                            onChange={(e) => this.handleColumnChange(index, e)}
                            placeholder={`Column ${index + 1}`}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => this.deleteGridColumn(index)}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <button className="btn btn-outline-dark" onClick={this.addGridRow}>
                      Add Row
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-outline-dark" onClick={this.addGridColumn}>
                      Add Column
                    </button>
                    {options.length > 0 && (
                      <button className="btn btn-outline-danger ms-2" onClick={clearGridSelections}>
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="form-check form-switch">
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

  toggleRequireResponse = () => {
    this.setState(prevState => ({
      requireResponse: !prevState.requireResponse,
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
    } else if (selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid') {
      this.setState((prevState) => ({
        gridOptions: {
          ...prevState.gridOptions,
          column: prevState.gridOptions.column.map((col, i) => {
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
    const { options, selectedOption } = this.state;
    if (selectedOption === 'linear' || selectedOption === 'multipleChoiceGrid' || selectedOption === 'checkboxGrid') {
      return true;
    }

    return options.length >= 2;
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

    this.setState({
      validationErrors: {
        questionType: isQuestionTypeValid ? '' : 'Select one question type',
        question: isQuestionValid ? '' : 'Enter the question',
        optionType: isOptionTypeValid ? '' : 'Select an option type',
        options: isOptionsValid ? '' : 'Add at least two options for this question',
        marks: isMarksValid ? '' : 'Enter the marks for this question',
        country: isCountriesValid ? '' : 'Select at least one country',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
      },
    });

    if (!isQuestionTypeValid || !isQuestionValid || !isOptionTypeValid || !isOptionsValid || !isMarksValid || !isCountriesValid || !isExplanationValid) {
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
      optionType: selectedOption,
      marks: isLeadingQuestion ? undefined : parseFloat(marks),
      countries: showCountry ? selectedCountries : undefined,
      explanation: showExplanation ? explanation : undefined,
      isLeadingQuestion,
      showCountry,
      requireResponse,
      nextQuestion: isLeadingQuestion ? undefined : nextQuestion
    };

    if (selectedOption === 'multipleChoice' || selectedOption === 'checkbox' || selectedOption === 'dropdown') {
      dataToInsert.options = options.map((option) => ({
        text: option.label,
        isCorrect: option.isCorrect || false, 
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
        columns: gridOptions.column.map(column => ({ text: column.label, isCorrect: column.isCorrect || false }))
      };
    }

    try {
      const response = await fetch('http://localhost:5000/api/insertQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToInsert),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        this.setState({
          question: '',
          marks: '',
          explanation: '',
          nextQuestion: '',
          questionType: '',
          selectedOption: 'multipleChoice',
          options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false }],
          gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column A', value: 'Column A' }] },
          showCountry: false,
          selectedCountries: [],
          isLeadingQuestion: false,
          showExplanation: false,
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
          showToast: true
        });
        const modalElement = this.editQuestionModalRef.current;
        if (modalElement) {
          const bootstrapModal = Modal.getInstance(modalElement);
          bootstrapModal.hide();
        }
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
        }
        this.setState({ showToast: true });
        setTimeout(() => this.setState({ showToast: false }), 10000);
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
        console.error('Network error:', error);
    }
  };









/* RENDER */



  render() {


    // debug
    //console.log('testFirstQuestion:', this.state.testFirstQuestion);

    // add allQuestions to this.state
    const { questionType, selectedOption, showCountry, countries, selectedCountries, isLeadingQuestion, showExplanation, validationErrors, testFirstQuestion, allQuestions,  question } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';

    return (
      
      <div>
        
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editQuestion" >Edit</button>

        {this.renderToast()}
        <div className="modal fade" id="editQuestion" tabIndex="-1" aria-labelledby="editQuestionLabel" aria-hidden="true" ref={this.editQuestionModalRef}>
        


        {/* Trying to implement map to load questions data 
        
        {allQuestions.map((question) => (

        */}
        
          <div className="question-selected">

            {/* */}
        
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="editQuestionLabel">
                    Edit Question
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
                    
                    
                    {/* Question label */}
                    <div className="mb-3">
                      <label htmlFor="question" className="col-form-label">
                        Question:
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="question" 
                        value={testFirstQuestion}
                        onChange={this.handleInputChange} />
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
        {/* ))} */}
        </div>
      </div>
    );
  }
}

export default EditQuestion;