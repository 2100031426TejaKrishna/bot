import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

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
      // Additional variables
      questionIndex: props.index,
      questionId: props.questionId,
      allQuestions: props.allQuestions,
      questionList: {
        question: null, 
        questionType: '',
        optionType: 'multipleChoice',
        options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false }],
        marks: '',
        nextQuestion: null
      },
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
    this.fetchQuestion(id).then( data => {
      this.setState(
        { 
          // questionList: data, 
        },
        // Callback function
        () => { 
          localStorage.setItem("formData", this.state.questionList)
        }
      )}
    );
  }

/*--------------API-----------------*/
  
  fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/editReadUpdate/${questionId}`);
      const data = await response.json();
      if (data) {
        this.setState({
          showModal: true, 
          questionList: data,
          selectedOption: data.optionType
        })
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  updateQuestion = async(questionId, dataToUpdate) => {
    console.log(`updateQuestion API executed`);
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
       
        const responseData = await response.json();

        // Trigger re-fetch in parent component
        console.log('Server response:', response);
        console.log('Parsed response data:', responseData);
        this.props.refreshQuestions();
 
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    console.log(`questionList: ${JSON.stringify(this.state.questionList)}`)
  };

/*-------------MODAL-----------------*/

  componentDidMount() {
    // reset
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.addEventListener('hidden.bs.modal', this.resetState);

    console.log(`componentDidMount executed`)
  }

  componentWillUnmount() {
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  }

/*---------------------------------*/

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
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, optionType: e.target.value }
    }))
  }

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

  editAddOption = (i) => {
    this.setState((prevState) => ({
      options: [...prevState.options, { label: `Option ${prevState.options.length + 1}`, value: `Option ${prevState.options.length + 1}`, isCorrect: false }],
    }));
    console.log(`editAddOption ${i}`)
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      questionList: { ...prevState.questionList, options: prevState.questionList.options.filter((_, i) => i !== index) }
    }),
      () => {
        console.log(`question: ${this.state.questionList.question}`)
        console.log(`optionType: ${this.state.questionList.optionType}`)
        console.log(`marks: ${this.state.questionList.marks}`)
        console.log(`nextQuestion: ${this.state.questionList.nextQuestion}`)
        for (let i = 0; i<this.state.questionList.options.length; i++) {
          console.log(`options text: ${this.state.questionList.options[i].text}`)
          console.log(`options isCorrect: ${this.state.questionList.options[i].isCorrect}`)
        }
      }
    );
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
    const updatedOptions = options.map((option, i) => (
      i === index ? { ...option, text: value } : option
    ));
    this.setState({ options: updatedOptions });
  };

  handleOptionChangeText = (index, value) => {
    const { questionList } = this.state;
    this.setState({ questionList: {
      ...questionList,
      options: questionList.options.map((option, i) =>
      i === index ? { ...option, text: value } : option
      ),
    }}) 
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

//------------------ OPTIONS ----------------------------------  
  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions, requireResponse, isLeadingQuestion, questionList } = this.state;
    const clearSelections = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedOptions = questionList.options.map((option) => ({
        ...option,
        text: '',
        isCorrect: false,
      }));
      this.setState({ questionList: {...this.state.questionList, options: clearedOptions} });
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
  
    // Loading of Options
    switch (questionList.optionType) {
//----------------------------- multiple choice ----------------------------
      case "multipleChoice":
        // check for more than one isCorrect truths, should only have one isCorrect truth for radio buttons
        let countIsCorrect = 0;
        
        for(let i=0; i<questionList.options.length; i++) {    
          if(questionList.options[i].isCorrect === true) {
            countIsCorrect ++
          }
        }

        if(countIsCorrect>1) {
          console.log(`countIsCorrect greater than 1`)
          this.setState((prevState) => ({
            questionList: {
              ...prevState.questionList,
              options: prevState.questionList.options.map((option) => ({
                ...option,
                isCorrect: false, // Set isCorrect to false for each option
              })),
            },
          }));
        }
        
        return (
          <>
            
            {/* Options label */}
            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  name="options"
                  className="form-check-input"
                  id={`form-${option}Radio`}
                  value={`${option}`}
                  checked={option.isCorrect}
                  disabled={isLeadingQuestion}
                  onChange={() => this.selectOptionsRadio(index, !option.isCorrect)}
                />
                <input
                  type="text"
                  id={`formOptions-${index}`}
                  className="form-control mx-2"
                  value={questionList.options[index].text}
                  onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {questionList.options.length > 1 && (
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
//----------------------------- checkbox ----------------------------      
      case "checkbox":
        return (
          <>
            {/* Options label */}
            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type={'checkbox'}
                  className="form-check-input"
                  checked={option.isCorrect}
                  disabled={isLeadingQuestion}
                  onChange={() => this.toggleCorrectAnswer(index)}
                />
                <input
                  type="text"
                  id={`formOptions-${index}`}
                  className="form-control mx-2"
                  value={questionList.options[index].text}
                  onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {questionList.options.length > 1 && (
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
//----------------------------- dropdown ----------------------------     
      case 'dropdown':
        return (
          <>
            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  disabled={isLeadingQuestion}
                  checked={option.isCorrect}
                  onChange={() => this.selectOptionsRadio(index, !option.isCorrect)}
                />
                <span className="mr-2">{index + 1}.</span>
                <input
                  type="text"
                  className="form-control mx-2"
                  value={option.text}
                  onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {questionList.options.length > 1 && (
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
    const { questionList } = this.state;
    if (questionList.optionType === 'linear' || questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      return true;
    }
    return questionList.options.length >= 2;
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
        marks: isMarksValid ? '' : 'Enter the marks (an integer value) for this question',
        country: isCountriesValid ? '' : 'Select at least one country',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
      },
    });

    if (!isQuestionTypeValid || !isQuestionValid || !isOptionTypeValid || !isOptionsValid || !isMarksValid || !isCountriesValid || !isExplanationValid) {
      return;
    }

    const {
      gridOptions,
      minScale,
      maxScale,
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
      marks: isLeadingQuestion ? undefined : parseFloat(this.state.questionList.marks),
      countries: showCountry ? selectedCountries : undefined,
      explanation: showExplanation ? explanation : undefined,
      isLeadingQuestion,
      showCountry,
      requireResponse,
      nextQuestion: isLeadingQuestion ? undefined : this.state.questionList.nextQuestion
    };
    // Case: multiple choce / checkbox / dropdown
    if (questionList.optionType === 'multipleChoice' || questionList.optionType === 'checkbox' || questionList.optionType === 'dropdown') {
      dataToUpdate.options = questionList.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect || false, 
      }));
    }
  
    if (questionList.optionType === 'linear') {
      dataToUpdate.linearScale = [
        { scale: minScale, label: document.getElementById('scaleLabel' + minScale).value },
        { scale: maxScale, label: document.getElementById('scaleLabel' + maxScale).value },
      ];
    }

    if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      dataToUpdate.grid = {
        rows: gridOptions.row.map(row => ({ text: row.label })),
        columns: gridOptions.column.map(column => ({ text: column.label, isCorrect: column.isCorrect || false }))
      };
    }
    
    // Update database API
    this.updateQuestion(questionId, dataToUpdate)
  };

/*---------------------RENDER----------------------------------*/

  render() {

    const { showCountry, countries, selectedCountries, isLeadingQuestion, showExplanation, validationErrors, questionId, questionIndex, allQuestions } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';

    return (
      
      <div>
        
        <button 
          className="btn btn-primary" 
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler(questionId)}>
            Edit
        </button>

        <Modal
          show={this.state.showModal === true}
          onHide={() => this.setState({ showModal: false })}
          backdrop="static"
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
              Edit Question
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
            <div className="mb-3">
                <div className="d-flex">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="questionType"
                      id="formProductInfoRadio"
                      value="productInfo"
                      checked={this.state.questionList.questionType === 'productInfo'}
                      onChange={this.handleQuestionTypeRadio}
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
                      id="formPackagingInfoRadio"
                      value="packagingInfo"
                      checked={this.state.questionList.questionType === 'packagingInfo'}
                      onChange={this.handleQuestionTypeRadio}
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

              {/* Options Type */}
              <div className="mb-3">
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
                </select>
                {validationErrors.optionType && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.optionType}
                  </div>
                )}
              </div>
              
              {/* Options */}
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

              {/* Marks */}
              {!isLeadingQuestion && (
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
              )}
              
              {/* Country */}
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
        </Modal.Footer>

        </Modal>



        {this.renderToast()}

        <div 
          className="modal fade" 
          id={`editQuestion`}
          //id={`editQuestionModal-${questionIndex}`}
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

export default EditQuestion;