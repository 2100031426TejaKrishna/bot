import React, { useEffect, useState, useRef } from 'react';
import './questions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [titleDetails, setTitleDetails] = useState({
        title: '',
        subtitle: '',
        nestedTitle: '',
    });
    const [titlesDetails, setTitlesDetails] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [gridAnswers, setGridAnswers] = useState({});
    const [openEndedText, setOpenEndedText] = useState('');
    const [openEndedWordLimit, setOpenEndedWordLimit] = useState(500);
    const [isWordCountExceeded, setIsWordCountExceeded] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [uniqueQuestions, setUniqueQuestions] = useState([]);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [navigationHistory, setNavigationHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountrySelection, setShowCountrySelection] = useState(true);
    const [countrySpecificQuestions, setCountrySpecificQuestions] = useState([]);
    const [hasSelectedCountries, setHasSelectedCountries] = useState(false);
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
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [searchQuery, setSearchQuery] = useState('');
    const countryRefs = useRef(countries.reduce((acc, country) => {
        acc[country] = React.createRef();
        return acc;
    }, {}));

    const navigate = useNavigate(); // Initialize the useNavigate hook
    // const destination = "localhost:5000";
    const destination = "rtp.dusky.bond:5000";

    useEffect(() => {
        const fetchQuestionsDetails = async () => {
            try {
                const response = await fetch(`http://${destination}/api/fetchQuestionsDetails`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTitlesDetails(data); // Store fetched title details
                setIsLoading(false);
                console.log("Questions Details: ", data);
            } catch (error) {
                console.error("Error fetching titles with details:", error);
            }
        };

        fetchQuestionsDetails();
    }, []);

    useEffect(() => {
        const fetchAllQuestions = async () => {
            try {
                const generalResponse = await fetch(`http://${destination}/api/fetchGeneralQuestions`);
                if (!generalResponse.ok) throw new Error(`HTTP error! status: ${generalResponse.status}`);
                const generalQuestions = await generalResponse.json();

                const countryResponse = await fetch(`http://${destination}/api/fetchQuestionsByCountries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ countries: [selectedCountry] }),
                });
                if (!countryResponse.ok) throw new Error(`HTTP error! status: ${countryResponse.status}`);
                const countryQuestions = await countryResponse.json();
                console.log("Fetched Questions:", countryQuestions);  // Log the fetched data for debugging
                
                // Merge general and country-specific questions
                const allQuestions = [...generalQuestions, ...countryQuestions];
                setQuestions(allQuestions);
                setIsLoading(false);
                if (allQuestions.length > 0) {
                    setCurrentQuestionIndex(0);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setIsLoading(false);
            }
        };

        if (selectedCountry) {
            fetchAllQuestions();
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (questions.length === 0) return;
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        let answer = answers[currentQuestionIndex];
        const prevAnswer = answers[currentQuestionIndex];
        if (prevAnswer) {
            if (Array.isArray(prevAnswer)) {
                setSelectedOptions(prevAnswer);
                setCanProceed(prevAnswer.length > 0);
            } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
                setGridAnswers(prevAnswer);
                const isValid = validateGridAnswersWithTempAnswers(prevAnswer, currentQuestion);
                setCanProceed(isValid);
            } else {
                setCurrentAnswer(prevAnswer);
                setCanProceed(prevAnswer.trim() !== '');
            }
        } else if (currentQuestion.optionType === 'openEnded') {
            setOpenEndedText(answer || '');
            setCanProceed(!!answer && answer.trim().length > 0);
        } else {
            setCurrentAnswer('');
            setSelectedOptions([]);
            setGridAnswers({});
            setCanProceed(false);
        }
    }, [currentQuestionIndex, answers, questions]);

    const handleAnswerChange = (event, optionType) => {
        if (optionType === 'checkbox') {
            const updatedOptions = event.target.checked
                ? [...selectedOptions, event.target.value]
                : selectedOptions.filter(option => option !== event.target.value);
            setSelectedOptions(updatedOptions);
            setCanProceed(updatedOptions.length > 0);
        } else if (optionType === 'openEnded') {
            const newText = event.target.value;
            setOpenEndedText(newText);
            const wordCount = getWordCount(newText);
            setIsWordCountExceeded(wordCount > openEndedWordLimit);
            setCanProceed(wordCount <= openEndedWordLimit && newText.trim().length > 0);
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

            updateAnswers(newGridAnswers);
            const isValid = validateGridAnswersWithTempAnswers(newGridAnswers);
            setCanProceed(isValid);

            return newGridAnswers;
        });
    };

    const validateGridAnswersWithTempAnswers = (tempAnswers, question) => {
        if (question.optionType === 'multipleChoiceGrid' || question.optionType === 'checkboxGrid') {
            if (question.requireResponse) {
                return question.grid.rows.every((_, rowIndex) => {
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

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        let newAnswer;

        if (currentQuestion.optionType === 'openEnded' && !canProceed) {
            alert("Please enter some text for the open-ended question before proceeding.");
            return; // Prevent moving to the next question if no input is provided
        }

        // Determine the new answer based on the question type
        if (currentQuestion.optionType === 'checkbox') {
            newAnswer = selectedOptions;
        } else if (currentQuestion.optionType.includes('Grid')) {
            newAnswer = gridAnswers;
        } else if (currentQuestion.optionType === 'openEnded') {
            newAnswer = openEndedText;
        } else {
            newAnswer = currentAnswer;
        }

        // Update answers state with the new answer
        updateAnswers(newAnswer);

        setNavigationHistory((prevHistory) => [...prevHistory, currentQuestionIndex]);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsLastQuestion(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);

            const prevQuestionAnswers = answers[currentQuestionIndex - 1];
            if (Array.isArray(prevQuestionAnswers)) {
                setSelectedOptions(prevQuestionAnswers);
            } else if (typeof prevQuestionAnswers === 'object' && prevQuestionAnswers !== null) {
                setGridAnswers(prevQuestionAnswers);
            } else {
                setCurrentAnswer(prevQuestionAnswers || '');
            }

            setIsLastQuestion(false);
            setCanProceed(true);
        }
    };

    const handleClearSelection = () => {
        const currentQuestion = questions[currentQuestionIndex];

        if (currentQuestion.optionType === 'checkboxGrid' || currentQuestion.optionType === 'multipleChoiceGrid') {
            const resetGridAnswers = {};
            currentQuestion.grid.rows.forEach((_, rowIndex) => {
                resetGridAnswers[rowIndex] = [];
            });
            setGridAnswers(resetGridAnswers);
            updateAnswers(resetGridAnswers);
        } else if (currentQuestion.optionType === 'checkbox') {
            setSelectedOptions([]);
            updateAnswers([]);
        } else {
            setCurrentAnswer('');
            updateAnswers('');
        }

        setCanProceed(false);
    };

    if (isLoading) {
        return <div>Loading questions details...</div>;
    }

    if (!titlesDetails.length) {
        return <div>No questions details available</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleSubmit = () => {
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowModal(false);
        const lastAnswer = currentQuestion.optionType.includes('Grid') ? gridAnswers : currentQuestion.optionType === 'checkbox' ? selectedOptions : currentAnswer;
        updateAnswers(lastAnswer);

        const answeredQuestions = questions.filter((question, index) => {
            const answer = answers[index];
            return answer !== undefined && ((Array.isArray(answer) && answer.length > 0) || (typeof answer === 'string' && answer.trim() !== '') || (typeof answer === 'object' && Object.keys(answer).length > 0));
        });

        const formattedResponses = answeredQuestions.map((question, index) => {
            const answerForQuestion = answers[index];
            return {
                questionId: question._id,
                answer: answerForQuestion,
            };
        });

        console.log("Submitted Answers:", formattedResponses);

        const userId = "1";

        try {
            const response = await fetch(`http://${destination}/api/submitResponse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, responses: formattedResponses, selectedCountry }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Response submitted successfully");
            
            // Navigate to the result page after successful submission
            navigate('/result');
        } catch (error) {
            console.error("Error submitting response:", error);
        }
    };

    const renderOptions = (question) => {
        if (!question) return null;
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
            case 'openEnded':
                return (
                    <>
                        <textarea
                            className="form-control"
                            value={openEndedText}
                            onChange={(e) => handleAnswerChange(e, 'openEnded')}
                            placeholder="Your answer..."
                        />
                        <div>
                            Words:{" "}
                            <span className={isWordCountExceeded ? "word-count-exceeded" : ""}>
                                {getWordCount(openEndedText)}/{openEndedWordLimit}
                            </span>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    const handleCountrySelectionConfirm = async () => {
        if (selectedCountry) {
            setShowCountrySelection(false);
            setHasSelectedCountries(true);

            try {
                let response = await fetch(`http://${destination}/api/selectedCountries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ countries: [selectedCountry] }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error on selectedCountries endpoint! status: ${response.status}`);
                }

                response = await fetch(`http://${destination}/api/fetchQuestionsByCountries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ countries: [selectedCountry] }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error on fetchQuestionsByCountries endpoint! status: ${response.status}`);
                }

                const countrySpecificQuestions = await response.json();
                console.log("Specific country questions:", countrySpecificQuestions);

                setCountrySpecificQuestions(countrySpecificQuestions);
                setQuestions(countrySpecificQuestions); // Update questions with country-specific questions
                setCurrentQuestionIndex(0); // Reset to the first question of the country-specific questions
                setIsLoading(false);

            } catch (error) {
                console.error("Error processing countries or fetching related questions:", error);
            }
        } else {
            alert("Please select a country.");
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = countries.filter(country =>
            country.toLowerCase().includes(query)
        );

        setFilteredCountries(filtered);
    };

    const scrollToCountry = (countryName) => {
        const countryRef = countryRefs.current[countryName];

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
                    <h5>Select which country to export</h5>
                    <div className="input-group mb-3 search-input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        </span>
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
                        {filteredCountries.map((country, index) => (
                            <div key={index} ref={countryRefs.current[country]}>
                                <input
                                    type="radio"
                                    id={`country_${country}`}
                                    value={country}
                                    onChange={() => handleCountrySelect(country)}
                                    checked={selectedCountry === country}
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
                        disabled={!selectedCountry}
                    >
                        Confirm
                    </button>
                </footer>
            </div>
        );
    }

    return (
        <div className="survey-questions-container">
            {isLoading && <div>Loading questions details...</div>}
            {!isLoading && !questions.length && <div>No questions available</div>}
            {!isLoading && questions.length > 0 && (
                <div className="survey-questions-card">
                    <h4>{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</h4>
                    <div className="options-container">
                        {renderOptions(questions[currentQuestionIndex])}
                    </div>
                    <footer className="survey-questions-footer">
                        <div className="survey-questions-navigation-buttons">
                            {currentQuestionIndex > 0 && (
                                <button className="survey-questions-button" onClick={handlePreviousQuestion}>Back</button>
                            )}
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed || isWordCountExceeded}>Next</button>
                            ) : (
                                <button className="survey-questions-button" onClick={handleSubmit} disabled={!canProceed || isWordCountExceeded}>Submit</button>
                            )}
                        </div>
                        <button className="survey-questions-button text-button" onClick={handleClearSelection}>Clear</button>
                    </footer>
                </div>
            )}
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
        </div>
    );
};

export default Questions;
