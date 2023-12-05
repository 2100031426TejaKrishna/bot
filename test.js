import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'multipleChoice',
      options: [{ label: '', value: '' }],
      gridOptions: [{ rowLabel: '', columnLabels: [''] }],
      showCountryDropdown: false,
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
      isLeadingQuestion: false,
      showExplanation: false,
    };
  }

  addOption = () => {
    const { options } = this.state;
    this.setState({ options: [...options, { label: '', value: '' }] });
  };

  addGridRow = () => {
    const { gridOptions } = this.state;
    this.setState({ gridOptions: [...gridOptions, { rowLabel: '', columnLabels: [''] }] });
  };

  addGridColumn = () => {
    const { gridOptions } = this.state;
    const updatedGridOptions = gridOptions.map(row => ({
      ...row,
      columnLabels: [...row.columnLabels, '']
    }));
    this.setState({ gridOptions: updatedGridOptions });
  };

  handleOptionChange = (index, value) => {
    const { options } = this.state;
    const updatedOptions = options.map((option, i) => (
      i === index ? { ...option, label: value, value: value } : option
    ));
    this.setState({ options: updatedOptions });
  };

  handleGridRowChange = (rowIndex, value) => {
    const { gridOptions } = this.state;
    const updatedGridOptions = gridOptions.map((row, i) => (
      i === rowIndex ? { ...row, rowLabel: value } : row
    ));
    this.setState({ gridOptions: updatedGridOptions });
  };

  handleGridColumnChange = (rowIndex, colIndex, value) => {
    const { gridOptions } = this.state;
    const updatedGridOptions = gridOptions.map((row, i) => {
      if (i === rowIndex) {
        const updatedColumnLabels = row.columnLabels.map((label, j) => (
          j === colIndex ? value : label
        ));
        return { ...row, columnLabels: updatedColumnLabels };
      }
      return row;
    });
    this.setState({ gridOptions: updatedGridOptions });
  };

  renderOptionsArea = () => {
    const { selectedOption, options, gridOptions, isLeadingQuestion } = this.state;

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
                        onChange={() => this.setCorrectAnswer(index)}
                        disabled={isLeadingQuestion}
                    />
                    <input
                        type="text"
                        className="form-control mx-2"
                        value={option.label}
                        onChange={(e) => this.handleOptionChange(index, e.target.value)}
                    />
                    {selectedOption === 'multipleChoice' && !isLeadingQuestion && (
                        <button
                            className={`btn ${option.isCorrect ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => this.setCorrectAnswer(index)}
                        >
                            Mark as Correct
                        </button>
                    )}
                </div>
            ))}
            <button className="btn btn-secondary" onClick={this.addOption}>Add Option</button>
          </>
        );
      case 'linear':
        return (
            <input type="range" className="form-range" min="1" max="10" />
        );
      case 'dropdown':
        return (
            <select className="form-select">
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        );
      case 'multipleChoiceGrid':
      case 'checkboxGrid':
        return (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                    {gridOptions[0].columnLabels.map((label, colIndex) => (
                      <th key={colIndex}>
                          <input
                              type="text"
                              className="form-control"
                              value={label}
                              onChange={(e) => this.handleGridColumnChange(0, colIndex, e.target.value)}
                          />
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {gridOptions.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.rowLabel}
                        onChange={(e) => this.handleGridRowChange(rowIndex, e.target.value)}
                     />
                    </td>
                      {row.columnLabels.map((label, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type={selectedOption === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                            name={`row-${rowIndex}`}
                            value={label}
                          />
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-secondary" onClick={this.addGridRow}>Add Row</button>
            <button className="btn btn-secondary ms-2" onClick={this.addGridColumn}>Add Column</button>
          </>
        );
      default:
        return null;
    }
  };

  toggleCountryDropdown = () => {
    this.setState(prevState => ({
      showCountryDropdown: !prevState.showCountryDropdown
    }));
  };

  toggleLeadingQuestion = () => {
    this.setState(prevState => ({
      isLeadingQuestion: !prevState.isLeadingQuestion,
    }));
  };

  setCorrectAnswer = (index) => {
    if (this.state.isLeadingQuestion) return;

    const updatedOptions = this.state.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    this.setState({ options: updatedOptions });
  };

  toggleExplanation = () => {
    this.setState((prevState) => ({
      showExplanation: !prevState.showExplanation,
    }));
  };

  render() {
    const { selectedOption, showCountryDropdown, countries, isLeadingQuestion, showExplanation } = this.state;
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="createQuestionLabel">
                  New Question
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="questionType"
                      id="productInfoRadio"
                      value="productInfo"
                      checked={selectedOption === 'productInfo'}
                      onChange={() => this.setState({ selectedOption: 'productInfo' })}
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
                      checked={selectedOption === 'packagingInfo'}
                      onChange={() => this.setState({ selectedOption: 'packagingInfo' })}
                    />
                    <label className="form-check-label" htmlFor="packagingInfo">
                      Packaging Information
                    </label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="question" className="col-form-label">
                      Question:
                    </label>
                    <input type="text" className="form-control" id="question" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="optionsSelection" className="col-form-label">
                      Options Selection:
                    </label>
                    <select
                      className="form-select"
                      id="optionsSelection"
                      value={selectedOption}
                      onChange={this.generateOptions}
                    >
                      <option value="multipleChoice">Multiple Choice</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="linear">Linear</option>
                      <option value="dropdown">Dropdown</option>
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
                      <textarea className="form-control" id="explanation"></textarea>
                    </div>
                  )}
                  {!isLeadingQuestion && (
                    <div className="mb-3">
                      <label htmlFor="marks" className="col-form-label">
                        Marks:
                      </label>
                      <input type="text" className="form-control" id="marks" />
                    </div>
                  )}
                  {showCountryDropdown && (
                    <div className="mb-3">
                      <label htmlFor="country" className="col-form-label">
                        Country:
                      </label>
                      <select className="form-select" aria-label="Country" id="country">
                        {countries.map((country, index) => (
                          <option key={index} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <hr/>
                  <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="specific"
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
                      onChange={this.toggleExplanation}
                    />
                    <label className="form-check-label" htmlFor="explanationCheck">
                      {explanationLabel}:
                    </label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateQuestion;