import React, { useEffect, useState, useRef } from 'react';
import './questions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [gridAnswers, setGridAnswers] = useState({});
    const [openEndedText, setOpenEndedText] = useState('');
    const [openEndedWordLimit, setOpenEndedWordLimit] = useState(500);
    const [isWordCountExceeded, setIsWordCountExceeded] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [navigationHistory, setNavigationHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCountrySelectionModal, setShowCountrySelectionModal] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [showCountrySelection, setShowCountrySelection] = useState(false);
    const [generalQuestions, setGeneralQuestions] = useState([]);
    const [currentStage, setCurrentStage] = useState('general');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendations, setRecommendations] = useState({});
    const [currentTitle, setCurrentTitle] = useState('');
    const [questionOrder, setQuestionOrder] = useState([]);
    const [countryQuestions, setCountryQuestions] = useState([]);
    const [titles, setTitles] = useState({});

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
    const countryRefs = useRef(countries.reduce((acc, country) => {
        acc[country] = React.createRef();
        return acc;
    }, {}));
    const navigate = useNavigate();
    const destination = "localhost:5000";
    // const destination = "rtp.dusky.bond:5000";

    useEffect(() => {
        const fetchGeneralQuestions = async () => {
            try {
                const response = await fetch(`http://${destination}/api/fetchGeneralQuestions`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const generalQuestions = await response.json();
                setGeneralQuestions(generalQuestions);
                setQuestions(generalQuestions);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching general questions:", error);
                setIsLoading(false);
            }
        };
        fetchGeneralQuestions();
    }, [destination]);

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const titlesMap = {};
                for (const question of questions) {
                    const response = await fetch(`http://${destination}/api/fetchTitleForQuestion/${question._id}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const { title } = await response.json();
                    titlesMap[question._id] = title;
                }
                setTitles(titlesMap);
                const sortedQuestions = questions.sort((a, b) => {
                    const titleA = titlesMap[a._id].toLowerCase();
                    const titleB = titlesMap[b._id].toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                setQuestionOrder(sortedQuestions);
            } catch (error) {
                console.error("Error fetching titles:", error);
            }
        };

        if (questions.length > 0) {
            fetchTitles();
        }
    }, [questions]);

    useEffect(() => {
        if (questionOrder.length === 0) return;
        const currentQuestion = questionOrder[currentQuestionIndex];
        if (!currentQuestion) {
            setCurrentTitle('');
            return;
        }

        const prevAnswer = answers[currentQuestion._id];
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
            setOpenEndedText(prevAnswer || '');
            setCanProceed(!!prevAnswer && prevAnswer.trim().length > 0);
        } else {
            setCurrentAnswer('');
            setSelectedOptions([]);
            setGridAnswers({});
            setCanProceed(false);
        }

        if (currentQuestion.options) {
            currentQuestion.options.forEach(async (option) => {
                try {
                    const response = await fetch(`http://${destination}/api/recommendationText/${option._id}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const { recommendations } = await response.json();
                    setRecommendations((prevRecommendations) => ({
                        ...prevRecommendations,
                        [option._id]: recommendations
                    }));
                } catch (error) {
                    console.error("Error fetching recommendation:", error);
                }
            });
        }

        setCurrentTitle(titles[currentQuestion._id] || '');
    }, [currentQuestionIndex, answers, questionOrder, titles]);

    const handleAnswerChange = async (event, optionType) => {
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
        const currentQuestion = questionOrder[currentQuestionIndex];
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

            updateAnswers(newGridAnswers, currentQuestion._id);
            const isValid = validateGridAnswersWithTempAnswers(newGridAnswers, currentQuestion);
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

    const updateAnswers = (newAnswer, questionId) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: newAnswer
        }));
    };

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const handleNextQuestion = () => {
        const currentQuestion = questionOrder[currentQuestionIndex];
        let newAnswer;

        if (currentQuestion.optionType === 'openEnded' && !canProceed) {
            alert("Please enter some text for the open-ended question before proceeding.");
            return;
        }

        if (currentQuestion.optionType === 'checkbox') {
            newAnswer = selectedOptions;
        } else if (currentQuestion.optionType.includes('Grid')) {
            newAnswer = gridAnswers;
        } else if (currentQuestion.optionType === 'openEnded') {
            newAnswer = openEndedText;
        } else {
            newAnswer = currentAnswer;
        }

        updateAnswers(newAnswer, currentQuestion._id);

        setNavigationHistory((prevHistory) => [...prevHistory, currentQuestionIndex]);

        if (currentQuestionIndex < questionOrder.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setRecommendations({}); // Clear recommendations when moving to next question
        } else if (currentStage === 'general') {
            setShowCountrySelection(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setRecommendations({}); // Clear recommendations when moving to previous question

            const prevQuestionAnswers = answers[questionOrder[currentQuestionIndex - 1]._id];
            if (Array.isArray(prevQuestionAnswers)) {
                setSelectedOptions(prevQuestionAnswers);
            } else if (typeof prevQuestionAnswers === 'object' && prevQuestionAnswers !== null) {
                setGridAnswers(prevQuestionAnswers);
            } else {
                setCurrentAnswer(prevQuestionAnswers || '');
            }

            setCanProceed(true);
        }
    };

    const handleClearSelection = () => {
        const currentQuestion = questionOrder[currentQuestionIndex];

        if (currentQuestion.optionType === 'checkboxGrid' || currentQuestion.optionType === 'multipleChoiceGrid') {
            const resetGridAnswers = {};
            currentQuestion.grid.rows.forEach((_, rowIndex) => {
                resetGridAnswers[rowIndex] = [];
            });
            setGridAnswers(resetGridAnswers);
            updateAnswers(resetGridAnswers, currentQuestion._id);
        } else if (currentQuestion.optionType === 'checkbox') {
            setSelectedOptions([]);
            updateAnswers([], currentQuestion._id);
        } else {
            setCurrentAnswer('');
            updateAnswers('', currentQuestion._id);
        }

        setCanProceed(false);
    };

    const handleCountrySelect = (country) => {
        setSelectedCountries((prevSelectedCountries) =>
            prevSelectedCountries.includes(country)
                ? prevSelectedCountries.filter((c) => c !== country)
                : [...prevSelectedCountries, country]
        );
    };

    const handleCountrySelectionConfirm = () => {
        const currentQuestion = questionOrder[currentQuestionIndex];
        let newAnswer;

        if (currentQuestion.optionType === 'checkbox') {
            newAnswer = selectedOptions;
        } else if (currentQuestion.optionType.includes('Grid')) {
            newAnswer = gridAnswers;
        } else if (currentQuestion.optionType === 'openEnded') {
            newAnswer = openEndedText;
        } else {
            newAnswer = currentAnswer;
        }

        updateAnswers(newAnswer, currentQuestion._id);
        setShowCountrySelectionModal(true);
    };

    const handleCountrySelectionModalConfirm = async () => {
        if (selectedCountries.length > 0) {
            setShowCountrySelection(false);
            setShowCountrySelectionModal(false);

            try {
                const response = await fetch(`http://${destination}/api/fetchQuestionsByCountries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ countries: selectedCountries }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error on fetchQuestionsByCountries endpoint! status: ${response.status}`);
                }

                const countrySpecificQuestions = await response.json();
                console.log("Specific country questions:", countrySpecificQuestions);

                if (countrySpecificQuestions.length === 0) {
                    alert("No questions available for the selected countries.");
                    setShowCountrySelection(true);
                    setCurrentStage('general');
                    return;
                }

                setCountryQuestions(countrySpecificQuestions); // Set only country-specific questions
                setQuestions(countrySpecificQuestions); // Include only country-specific questions
                setCurrentQuestionIndex(0); // Start from the first country-specific question
                setCurrentStage('country');
                setIsLoading(false);

            } catch (error) {
                console.error("Error processing countries or fetching related questions:", error);
            }
        } else {
            alert("Please select at least one country.");
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

    const handleSubmit = () => {
        const currentQuestion = questionOrder[currentQuestionIndex];
        let newAnswer;

        if (currentQuestion.optionType === 'checkbox') {
            newAnswer = selectedOptions;
        } else if (currentQuestion.optionType.includes('Grid')) {
            newAnswer = gridAnswers;
        } else if (currentQuestion.optionType === 'openEnded') {
            newAnswer = openEndedText;
        } else {
            newAnswer = currentAnswer;
        }

        updateAnswers(newAnswer, currentQuestion._id);
        setShowModal(true);
    };

    const handleConfirmSubmit = () => {
        const currentQuestion = questionOrder[currentQuestionIndex];
        const lastAnswer = currentQuestion.optionType.includes('Grid') ? gridAnswers : currentQuestion.optionType === 'checkbox' ? selectedOptions : currentAnswer;
        updateAnswers(lastAnswer, currentQuestion._id);

        const answeredQuestions = [...generalQuestions, ...countryQuestions].map((question) => {
            const answer = answers[question._id];
            return {
                questionId: question._id,
                question: question.question,
                answer: answer,
            };
        });

        console.log("Submitted Answers:", answeredQuestions);

        localStorage.setItem('surveyResponses', JSON.stringify(answeredQuestions));

        navigate('/responses');
    };

    if (isLoading) {
        return <div>Loading questions...</div>;
    }

    const showCountrySelectionButton = currentStage === 'general' && currentQuestionIndex === questionOrder.length - 1;

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
                            onChange={(e) => handleAnswerChange(e, 'multipleChoice')}
                            checked={currentAnswer === option.text}
                            className="form-check-input"
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                        {recommendations[option._id] && (
                            <div className="recommendation-text">
                                <strong>Recommendation:</strong> {recommendations[option._id]}
                            </div>
                        )}
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
                        {recommendations[option._id] && (
                            <div className="recommendation-text">
                                <strong>Recommendation:</strong> {recommendations[option._id]}
                            </div>
                        )}
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
            case 'debug':
                return (
                    <pre>{JSON.stringify(question.options, null, 2)}</pre>
                );
            default:
                return null;
        }
    };

    const renderCountrySelection = () => {
        return (
            <div className="survey-questions-container">
                <div className="survey-questions-card">
                    <h5>Select countries to export</h5>
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
    };

    return (
        <div className="survey-questions-container">
            {isLoading && <div>Loading questions...</div>}
            {!isLoading && !questionOrder.length && <div>Sorting questions</div>}
            {!isLoading && questionOrder.length > 0 && (
                <div className="survey-questions-card">
                    {currentTitle && <h5 className="survey-questions-title">{currentTitle}</h5>}
                    <h4>{currentStage === 'general' ? currentQuestionIndex + 1 : currentQuestionIndex + 1}. {questionOrder[currentQuestionIndex]?.question || 'Select Country'}</h4>
                    <div className="options-container">
                        {renderOptions(questionOrder[currentQuestionIndex])}
                    </div>
                    <footer className="survey-questions-footer">
                        <div className="survey-questions-navigation-buttons">
                            {(currentStage === 'general' && currentQuestionIndex > 0) || 
                            (currentStage === 'country' && currentQuestionIndex > 0) ? (
                                <button className="survey-questions-button" onClick={handlePreviousQuestion}>Back</button>
                            ) : null}
                            {showCountrySelectionButton ? (
                                <button className="survey-questions-button" onClick={() => setShowCountrySelection(true)}>Go to Country Selection</button>
                            ) : currentQuestionIndex < questionOrder.length - 1 ? (
                                <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed || isWordCountExceeded}>Next</button>
                            ) : (
                                <button className="survey-questions-button" onClick={handleSubmit} disabled={!canProceed || isWordCountExceeded}>Submit</button>
                            )}
                        </div>
                        <button className="survey-questions-button text-button" onClick={handleClearSelection}>Clear</button>
                    </footer>
                </div>
            )}
            {showCountrySelection && renderCountrySelection()}
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
            {showCountrySelectionModal && (
                <div className="modal show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Navigation</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowCountrySelectionModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to navigate? You can't go back once you confirm.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowCountrySelectionModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleCountrySelectionModalConfirm}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Questions;