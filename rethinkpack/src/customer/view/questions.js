import React, { useEffect, useState, useRef } from 'react';
import './questions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [gridAnswers, setGridAnswers] = useState({});
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [uniqueQuestions, setUniqueQuestions] = useState([]);
    const [currentUniqueIndex, setCurrentUniqueIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [navigationHistory, setNavigationHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [showCountrySelection, setShowCountrySelection] = useState(true);
    const countries = [
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
    ];
    const [searchQuery, setSearchQuery] = useState('');
    const countryRefs = useRef(countries.reduce((acc, country) => {
        acc[country] = React.createRef();
        return acc;
    }, {}));

    // const destination = "localhost:5000";
    const destination = "rtp.dusky.bond:5000";

    useEffect(() => {
        const fetchAllQuestions = async () => {
            try {
                const selectedCountriesParam = selectedCountries.join(',');
                const response = await fetch(`http://${destination}/api/fetchQuestions?countries=${selectedCountriesParam}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data); 
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching all questions:", error);
                setIsLoading(false);
            }
        };
    
        if (!showCountrySelection) {
            fetchAllQuestions();
        }
    }, [showCountrySelection, selectedCountries]);

    useEffect(() => {
        const prevAnswer = answers[currentQuestionIndex];
        if (prevAnswer) {
            if (Array.isArray(prevAnswer)) {
                setSelectedOptions(prevAnswer);
            } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
                setGridAnswers(prevAnswer);
            } else {
                setCurrentAnswer(prevAnswer);
            }
        } else {
            setCurrentAnswer('');
            setSelectedOptions([]);
            setGridAnswers({});
        }
        setCanProceed(!!prevAnswer);
    }, [currentQuestionIndex, answers]);
    
    const handleAnswerChange = (event, optionType) => {
        if (optionType === 'checkbox') {
            const updatedOptions = event.target.checked
                ? [...selectedOptions, event.target.value]
                : selectedOptions.filter(option => option !== event.target.value);
            setSelectedOptions(updatedOptions);
            setCanProceed(updatedOptions.length > 0);
        } else {
            setCurrentAnswer(event.target.value);
            setCanProceed(event.target.value.trim() !== '');
        }
    };

    const handleGridAnswerChange = (rowIndex, colIndex, optionType) => {
        setGridAnswers((prevGridAnswers) => {
            const newGridAnswers = { ...prevGridAnswers };
    
            if (optionType === 'checkboxGrid') {
                newGridAnswers[rowIndex] = newGridAnswers[rowIndex] || [];
                if (newGridAnswers[rowIndex].includes(colIndex)) {
                    newGridAnswers[rowIndex] = newGridAnswers[rowIndex].filter(
                        (item) => item !== colIndex
                    );
                } else {
                    newGridAnswers[rowIndex].push(colIndex);
                }
            } else {
                newGridAnswers[rowIndex] = [colIndex];
            }
    
            const isValid = validateGridAnswersWithTempAnswers(newGridAnswers);
            setCanProceed(isValid);
    
            return newGridAnswers;
        });
    };

    const validateGridAnswersWithTempAnswers = (tempAnswers) => {
        if (currentQuestion.optionType === 'multipleChoiceGrid' || currentQuestion.optionType === 'checkboxGrid') {
            if (currentQuestion.requireResponse) {
                return currentQuestion.grid.rows.every((_, rowIndex) => {
                    const rowAnswers = tempAnswers[rowIndex] || [];
                    return rowAnswers.length > 0;
                });
            }
        }
        return true;
    };

    const updateAnswers = (newAnswer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestionIndex]: newAnswer
        }));
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        let newAnswer;
    
        // Determine the new answer based on the question type
        if (currentQuestion.optionType === 'checkbox') {
            newAnswer = selectedOptions;
        } else if (currentQuestion.optionType.includes('Grid')) {
            newAnswer = gridAnswers;
        } else {
            newAnswer = currentAnswer;
        }
    
        // Update answers state with the new answer
        updateAnswers(newAnswer);
    
        let nextQuestionId = null;
        // Determine if there's a next question specific to the selected option
        if (currentQuestion.optionType === 'multipleChoice' || currentQuestion.optionType === 'dropdown') {
            const selectedOption = currentQuestion.options.find(option => option.text === currentAnswer);
            if (selectedOption && selectedOption.optionsNextQuestion) {
                nextQuestionId = selectedOption.optionsNextQuestion;
            }
        }
    
        setNavigationHistory((prevHistory) => [...prevHistory, currentQuestionIndex]);
        
        if (nextQuestionId) {
            navigateToNextQuestionById(nextQuestionId);
        } else if (currentQuestion.nextQuestion) {
            navigateToNextQuestionById(currentQuestion.nextQuestion);
        } else {
            // Set isLastQuestion to true if there are no further questions defined
            setIsLastQuestion(true);
        }

    };
    
    const navigateToNextQuestionById = (nextQuestionId) => {
        const nextQuestionIndex = questions.findIndex(question => question._id === nextQuestionId);
        if (nextQuestionIndex !== -1) {
            if (!uniqueQuestions.includes(nextQuestionId)) {
                // Update uniqueQuestions only if the nextQuestionId is not already included
                const updatedUniqueQuestions = [...uniqueQuestions, nextQuestionId];
                setUniqueQuestions(updatedUniqueQuestions);
            }
            setCurrentUniqueIndex(uniqueQuestions.indexOf(nextQuestionId));
            setCurrentQuestionIndex(nextQuestionIndex);
            setIsLastQuestion(false); // Reset this flag when navigating to another question
        } else {
            // If the next question ID is invalid or doesn't exist, consider it the end of the survey
            setIsLastQuestion(true);
        }
    };
    
    const handlePreviousQuestion = () => {
        setNavigationHistory((prevHistory) => {
            if (prevHistory.length > 1) {
                const newHistory = [...prevHistory];
                newHistory.pop(); // Remove the current question index from history
                const prevQuestionIndex = newHistory[newHistory.length - 1]; // Get the previous question index
    
                setCurrentQuestionIndex(prevQuestionIndex);
    
                // Restore previous answers to the UI
                const prevQuestionAnswers = answers[prevQuestionIndex];
                if (Array.isArray(prevQuestionAnswers)) {
                    setSelectedOptions(prevQuestionAnswers);
                } else if (typeof prevQuestionAnswers === 'object' && prevQuestionAnswers !== null) {
                    setGridAnswers(prevQuestionAnswers);
                } else {
                    setCurrentAnswer(prevQuestionAnswers || '');
                }
    
                // Determine if the previous question should show the "Next" or "Submit" button
                const prevQuestion = questions[prevQuestionIndex];
                const hasFollowingQuestion = prevQuestion.nextQuestion || (prevQuestionIndex < questions.length - 1 && newHistory.includes(prevQuestionIndex + 1));
                setIsLastQuestion(!hasFollowingQuestion);
                setCanProceed(true);
    
                return newHistory;
            }
            return prevHistory;
        });
    };

    const handleClearSelection = () => {
        if (currentQuestion.optionType === 'checkboxGrid' || currentQuestion.optionType === 'multipleChoiceGrid') {
            // Initialize an empty object to reset gridAnswers
            const resetGridAnswers = {};
            // If it's a multipleChoiceGrid, we need to reset each row's answer
            if (currentQuestion.optionType === 'multipleChoiceGrid') {
                currentQuestion.grid.rows.forEach((_, rowIndex) => {
                    // For multipleChoiceGrid, reset each row's selection to an empty array or null
                    resetGridAnswers[rowIndex] = []; // or you might set it to null, depending on your validation logic
                });
            } else {
                // For checkboxGrid, a simple reset is enough, but kept inside for future customization
                currentQuestion.grid.rows.forEach((_, rowIndex) => {
                    resetGridAnswers[rowIndex] = [];
                });
            }
            setGridAnswers(resetGridAnswers);
        } else if (currentQuestion.optionType === 'checkbox') {
            setSelectedOptions([]);
        } else {
            setCurrentAnswer('');
        }
    
        setCanProceed(false);
    };

    if (isLoading) {
        return <div>Loading questions...</div>;
    }

    if (!questions.length) {
        return <div>No questions available</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleSubmit = () => {
        setShowModal(true);
      };

    const handleConfirmSubmit = async () => {
        setShowModal(false);

        const lastAnswer = currentQuestion.optionType.includes('Grid') ? gridAnswers : currentQuestion.optionType === 'checkbox' ? selectedOptions : currentAnswer;
        updateAnswers(lastAnswer); 

        console.log("Submitted Answers:", {
            ...answers, 
            [currentQuestionIndex]: lastAnswer 
        });
    
        const userId = "1"; 
        const formattedResponses = questions.map((question, index) => ({
            questionId: question._id,
            answer: answers[index] || lastAnswer,
        }));
    
        try {
            const response = await fetch(`http://${destination}/api/submitResponse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, responses: formattedResponses }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Response submitted successfully");
        } catch (error) {
            console.error("Error submitting response:", error);
        }
    };

    const renderOptions = (question) => {
        switch (question.optionType) {
            case 'multipleChoice':
                return question.options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            id={`option_${index}`}
                            value={option.text}
                            onChange={handleAnswerChange}
                            checked={currentAnswer === option.text}
                            className="form-check-input"
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                    </div>
                ));
            case 'checkbox':
                return question.options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`option_${index}`}
                            value={option.text}
                            onChange={(e) => handleAnswerChange(e, 'checkbox')}
                            checked={selectedOptions.includes(option.text)}
                            className="form-check-input"
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                    </div>
                ));
            case 'dropdown':
                return (
                    <select
                        className="form-select"
                        aria-label="Dropdown select example"
                        onChange={handleAnswerChange}
                        value={currentAnswer || "placeholder"} 
                    >
                        <option value="placeholder" disabled hidden>Select an option</option> 
                        {question.options.map((option, index) => (
                            <option key={index} value={option.text}>{option.text}</option>
                        ))}
                    </select>
                );
                case 'linear':
                    const scaleStart = question.linearScale[0].scale;
                    const scaleEnd = question.linearScale[1].scale;
                    const startLabel = question.linearScale[0].label;
                    const endLabel = question.linearScale[1].label;
                    
                    const scaleValues = Array.from({ length: scaleEnd - scaleStart + 1 }, (_, i) => scaleStart + i);
                    
                    return (
                        <div className="custom-linear-scale">
                            {startLabel && <div className="custom-scale-label">{startLabel}</div>}
                            {scaleValues.map((value, index) => (
                                <div key={index} className="custom-scale-option">
                                    <span className="custom-scale-option-value">{value}</span>
                                    <input
                                        type="radio"
                                        name="linearScale"
                                        value={value}
                                        onChange={handleAnswerChange}
                                        checked={currentAnswer === String(value)}
                                        className="form-check-input"
                                    />
                                </div>
                            ))}
                            {endLabel && <div className="custom-scale-label">{endLabel}</div>}
                        </div>
                    );
            case 'multipleChoiceGrid':
            case 'checkboxGrid':
                return (
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {question.grid.columns.map((col, colIndex) => (
                                    <th key={colIndex} className="table-header-non-bold">{col.text}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {question.grid.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{row.text}</td>
                                    {question.grid.columns.map((_, colIndex) => (
                                        <td key={colIndex}>
                                            <input
                                                type={question.optionType === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                                                name={question.optionType === 'multipleChoiceGrid' ? `row_${rowIndex}` : `row_${rowIndex}_col_${colIndex}`}
                                                value={`${rowIndex}-${colIndex}`}
                                                onChange={() => handleGridAnswerChange(rowIndex, colIndex, question.optionType)}
                                                checked={gridAnswers[rowIndex]?.includes(colIndex)}
                                                className="form-check-input"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    const handleCountrySelect = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(selectedCountries.filter(selectedCountry => selectedCountry !== country));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    // Function to confirm country selection and proceed to questions
    const handleCountrySelectionConfirm = () => {
        if (selectedCountries.length > 0) {
            setShowCountrySelection(false);
            // The useEffect hook will automatically fetch the questions based on the selected countries.
        } else {
            alert("Please select at least one country.");
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    
        // Assuming countries are unique and directly mapping to their refs
        const matchedCountry = countries.find(country =>
            country.toLowerCase().startsWith(query)
        );
    
        console.log("Matched Country:", matchedCountry);
    
        if (matchedCountry) {
            scrollToCountry(matchedCountry);
        }
    };
    
    const scrollToCountry = (countryName) => {
        const countryRef = countryRefs.current[countryName];
        console.log("Scrolling to:", countryName, countryRef); 
    
        if (countryRef && countryRef.current) {
            countryRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    };

    if (showCountrySelection) {
        return (
            <div className="survey-questions-container">
                <div className="survey-questions-card">
                    <h5>Select which countries to export</h5>
                    <div className="input-group mb-3 search-input-group">
                        <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faSearch} className="search-icon" /></span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Type to search..." 
                            aria-label="Search"
                            aria-describedby="basic-addon1"
                            onChange={handleSearchChange} 
                            value={searchQuery}
                        />
                        {searchQuery && (
                            <button className="btn btn-outline-secondary" type="button" id="button-clear" onClick={() => setSearchQuery('')}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                    <div className="options-container options-container-fixed-height">
                        {countries.map((country, index) => (
                            <div key={index} ref={countryRefs.current[country]}>
                            <input
                                type="checkbox"
                                id={`country_${country}`} 
                                value={country}
                                onChange={() => handleCountrySelect(country)}
                                checked={selectedCountries.includes(country)}
                                className="form-check-input"
                            />
                            <label htmlFor={`country_${country}`}>{country}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <footer className="survey-questions-footer">
                    <button 
                        className="survey-questions-button" 
                        onClick={handleCountrySelectionConfirm}
                        disabled={selectedCountries.length === 0}
                    >
                        Confirm
                    </button>
                </footer>
            </div>
        );
    }

    return (
        <div className="survey-questions-container">
            <div className="survey-questions-card">
                <h6>
                    {currentQuestion.questionType === 'productInfo' ? 'Product Information' : 
                    currentQuestion.questionType === 'packagingInfo' ? 'Packaging Information' : ''}
                </h6>
                <h4>{currentQuestion.question}</h4>
                <div className="options-container">
                    {renderOptions(currentQuestion)}
                </div>
            </div>
            {/* <div className="survey-questions-progress-bar-container">
                <div className="survey-questions-progress-bar">
                    <div className="survey-questions-progress-bar-fill" style={{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }}></div>
                </div>
            </div> */}
            {showModal && (
                <div className="modal show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">Confirm Submission</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                        <p>Are you sure you want to submit your answers?</p>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirmSubmit}>Confirm</button>
                        </div>
                    </div>
                    </div>
                </div>
            )}
            <footer className="survey-questions-footer">
                <div className="survey-questions-navigation-buttons">
                    {currentQuestionIndex > 0 && (
                        <button className="survey-questions-button" onClick={handlePreviousQuestion}>Back</button>
                    )}
                    {isLastQuestion ? (
                        <button className="survey-questions-button" onClick={handleSubmit} disabled={!canProceed}>Submit</button>
                    ) : (
                        <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed}>Next</button>
                    )}
                    </div>
                <button className="survey-questions-button text-button" onClick={handleClearSelection}>Clear</button>
            </footer>
        </div>
    );
};

export default Questions;