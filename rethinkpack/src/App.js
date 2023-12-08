import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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
      options: [{ label: 'Option 1', value: 'Option 1' }],
      gridOptions: [{ rowLabel: '', columnLabels: [''] }],
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
      minScale: 1,
      maxScale: 5
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState({ ...this.initialState });
  }

  componentDidMount() {
    const createQuestionModal = document.getElementById('createQuestion');
    createQuestionModal.addEventListener('hidden.bs.modal', this.resetState);
  }

  componentWillUnmount() {
    const createQuestionModal = document.getElementById('createQuestion');
    createQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  }

  addOption = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      options: [...prevState.options, { label: `Option ${prevState.options.length + 1}`, value: `Option ${prevState.options.length + 1}` }],
    }));
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      options: prevState.options.filter((_, i) => i !== index)
    }));
  };
  
  addGridRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      gridOptions: [
        ...prevState.gridOptions, 
        { rowLabel: '', columnLabels: [] } 
      ]
    }));
  };
  
  deleteGridRow = (rowIndex) => {
    this.setState(prevState => ({
      gridOptions: prevState.gridOptions.filter((_, i) => i !== rowIndex)
    }));
  };
  
  addGridColumn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => {
      const allRowsHaveColumns = prevState.gridOptions.every(row => row.columnLabels.length > 0);
      if (allRowsHaveColumns) {
        return {
          gridOptions: [
            ...prevState.gridOptions,
            { rowLabel: '', columnLabels: [''] } 
          ]
        };
      } else {
        return {
          gridOptions: prevState.gridOptions.map((row, index, array) => {
            if (index === array.findIndex(r => r.columnLabels.length < array[0].columnLabels.length)) {
                return { ...row, columnLabels: [...row.columnLabels, ''] };
            }
            return row;
          })
        };
      }
    });
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
      i === index ? { ...option, label: value, value: value } : option
    ));
    this.setState({ options: updatedOptions });
  };

  handleOptionInputChange = (e, index) => {
    this.handleOptionChange(index, e.target.value);
  };

  handleGridRowChange = (rowIndex, value) => {
    const { gridOptions } = this.state;
    const updatedGridOptions = gridOptions.map((row, i) => (
      i === rowIndex ? { ...row, rowLabel: value } : row
    ));
    this.setState({ gridOptions: updatedGridOptions });
  };

  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions } = this.state;
  
    switch (selectedOption) {
      case 'multipleChoice':
      case 'checkbox':
        return (
          <>
            {options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type={selectedOption === 'multipleChoice' ? 'checkbox' : 'checkbox'}
                  className="form-check-input"
                  checked={option.isCorrect}
                  disabled={this.state.isLeadingQuestion}
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
          </>
        );
  
      case 'multipleChoiceGrid':
      case 'checkboxGrid':
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
                {gridOptions.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{rowIndex + 1}.</span>
                        <input
                          type="text"
                          className="form-control mx-2"
                          value={row.rowLabel}
                          onChange={(e) => this.handleGridRowChange(rowIndex, e.target.value)}
                          placeholder={`Row ${rowIndex + 1}`}
                        />
                      </div>
                    </td>
                    {row.columnLabels.map((col, colIndex) => (
                      <td key={colIndex}>
                        <div className="d-flex align-items-center">
                          {selectedOption === 'multipleChoiceGrid' ? (
                            <>
                              <input
                                type="radio"
                                className="form-check-input"
                                disabled
                              />
                              <input
                                type="text"
                                className="form-control mx-2"
                                placeholder={`Column ${rowIndex + 1}`}
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                disabled
                              />
                              <input
                                type="text"
                                className="form-control mx-2"
                                placeholder={`Column ${rowIndex + 1}`}
                              />
                            </>
                          )}
                          {gridOptions.length > 1 && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => this.deleteGridRow(rowIndex)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td>
                    <button className="btn btn-outline-dark" onClick={this.addGridRow}>
                      Add Row
                    </button>
                  </td>
                  <td colSpan={gridOptions[0].columnLabels.length}>
                    <button className="btn btn-outline-dark" onClick={this.addGridColumn}>
                      Add Column
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      questionType,
      question,
      selectedOption,
      options,
      isLeadingQuestion,
      marks,
      showCountry,
      selectedCountries,
      explanation,
      nextQuestion,
    } = this.state;

    const dataToInsert = {
      questionType,
      question,
      optionType: selectedOption,
      options: options.map((option) => ({
        label: option.label,
        isCorrect: option.isCorrect || false, 
      })),
      marks: isLeadingQuestion ? undefined : marks,
      countries: showCountry ? selectedCountries : undefined,
      explanation: explanation,
      nextQuestion: isLeadingQuestion ? undefined : nextQuestion,
    };

    try {
      const response = await fetch('database/insertQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToInsert),
      });
  
      if (response.ok) {
        console.log('Data submitted successfully');
      } else {
        console.error('Error submitting data');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  render() {
    const { questionType, selectedOption, showCountry, countries, selectedCountries, isLeadingQuestion, showExplanation } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';

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
        <div className="modal fade" id="createQuestion" tabIndex="-1" aria-labelledby="createQuestionLabel" aria-hidden="true">
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="question" className="col-form-label">
                      Question:
                    </label>
                    <input type="text" className="form-control" id="question" value={this.state.question} onChange={this.handleInputChange} />
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
                  </div>
                  <div className="mb-3" id="optionsArea">
                    {this.renderOptionsArea()}
                  </div>
                  {showExplanation && (
                    <div className="mb-3">
                      <label htmlFor="explanation" className="col-form-label">
                        {explanationLabel}:
                      </label>
                      <textarea className="form-control" id="explanation" value={this.state.explanation} onChange={this.handleInputChange}></textarea>
                    </div>
                  )}
                  {!isLeadingQuestion && (
                    <div className="mb-3">
                      <label htmlFor="mark" className="col-form-label">
                        Marks:
                      </label>
                      <input type="text" className="form-control" id="mark" value={this.state.marks} onChange={this.handleInputChange} />
                    </div>
                  )}
                  {/* {showCountry && (
                    <div className="mb-3">
                      <label htmlFor="country" className="col-form-label">
                        Country:
                      </label>
                      <select className="form-select" aria-label="Country" id="country" value={selectedCountries} onChange={this.handleInputChange} size="5">
                        {countries.map((country, index) => (
                          <option key={index} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  )} */}
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