import React, { useEffect, useState } from 'react';
import './questions.css';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [gridAnswers, setGridAnswers] = useState({});
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});

    // const destination = "localhost:5000";
    const destination = "rtp.dusky.bond:5000";

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://${destination}/api/displayQuestionsCustomer`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

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
        const isAnswerSelected = () => {
            switch (currentQuestion.optionType) {
                case 'multipleChoice':
                case 'dropdown':
                case 'linear':
                    return currentAnswer.trim() !== '';
                case 'checkbox':
                    return selectedOptions.length > 0;
                case 'multipleChoiceGrid':
                case 'checkboxGrid':
                    return validateGridAnswers();
                default:
                    return false;
            }
        };
    
        if (currentQuestion.requireResponse && !isAnswerSelected()) {
            alert('Please select an answer.');
            return;
        }

        const newAnswer = currentQuestion.optionType.includes('Grid') ? gridAnswers : currentQuestion.optionType === 'checkbox' ? selectedOptions : currentAnswer;
        updateAnswers(newAnswer);
    
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentAnswer('');
            setSelectedOptions([]);
            setGridAnswers({});
            setCanProceed(false);
        }
    };

    const validateGridAnswers = () => {
        if (currentQuestion.optionType === 'multipleChoiceGrid' || currentQuestion.optionType === 'checkboxGrid') {
            if (currentQuestion.requireResponse) {
                return currentQuestion.grid.rows.every((_, rowIndex) => {
                    const rowAnswers = gridAnswers[rowIndex] || [];
                    return rowAnswers.length > 0;
                });
            }
        }
        return true;
    };
    
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setCurrentAnswer('');
            setCanProceed(true); 
        }
    };

    const handleClearSelection = () => {
        if (currentQuestion.optionType === 'checkboxGrid' || currentQuestion.optionType === 'multipleChoiceGrid') {
            setGridAnswers({});
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
        console.log("Submitted Answers:", answers);
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

    return (
        <div className="survey-questions-container">
            <div className="survey-questions-card">
                <h4>{currentQuestion.question}</h4>
                <div className="options-container">
                    {renderOptions(currentQuestion)}
                </div>
            </div>
            <div className="survey-questions-progress-bar-container">
                <div className="survey-questions-progress-bar">
                    <div className="survey-questions-progress-bar-fill" style={{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }}></div>
                </div>
            </div>
            <footer className="survey-questions-footer">
                <div className="survey-questions-navigation-buttons">
                    {currentQuestionIndex > 0 && (
                        <button className="survey-questions-button" onClick={handlePreviousQuestion}>Back</button>
                    )}
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed}>Next</button>
                    ) : (
                        <button className="survey-questions-button" onClick={handleSubmit}>Submit</button>
                    )}
                </div>
                <button className="survey-questions-button text-button" onClick={handleClearSelection}>Clear</button>
            </footer>
        </div>
    );
};

export default Questions;