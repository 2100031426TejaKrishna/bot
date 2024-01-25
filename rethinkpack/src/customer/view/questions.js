import React, { useEffect, useState } from 'react';
import './questions.css';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
    
    const handleAnswerChange = (event, optionIndex, rowIndex, colIndex) => {
        // Logic to handle different types of answer changes
        // For grid options, you might want to store an array or object
        // For simplicity, this example assumes an answer is a simple string or boolean
        setCurrentAnswer(event.target.value);
        // Set canProceed based on the validity of the answer
        setCanProceed(event.target.value.trim() !== '');
    };

    const handleNextQuestion = () => {
        if (canProceed) {
            // Check if it's not the last question before incrementing
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                // Reset the answer for the next question
                setCurrentAnswer('');
                // Reset the canProceed for the next question
                setCanProceed(false);
            }
        } else {
            alert('Please answer the current question before proceeding.');
        }
    };
    
    const handlePreviousQuestion = () => {
        // Check if it's not the first question before decrementing
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            // Reset the answer for the previous question (if needed)
            setCurrentAnswer('');
            // Ideally, you would also restore the previous answer here
            // For simplicity, we're just allowing to go back
            setCanProceed(true); // Assuming you can always go back
        }
    };


    if (isLoading) {
        return <div>Loading questions...</div>;
    }

    if (!questions.length) {
        return <div>No questions available</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    const renderOptions = (question) => {
        console.log(question);
        switch (question.optionType) {
            case 'multipleChoice':
            case 'checkbox':
                return question.options.map((option, index) => (
                    <div key={index}>
                        <input
                            type={question.optionType === 'multipleChoice' ? 'radio' : 'checkbox'}
                            id={`option_${index}`}
                            name={question.optionType === 'multipleChoice' ? 'radioGroup' : `checkbox_${index}`}
                            value={option.text}
                            onChange={handleAnswerChange}
                            checked={currentAnswer === option.text}
                            className="form-check-input"
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                    </div>
                ));
            case 'dropdown':
                return (
                    <select
                        className="form-select" 
                        aria-label="Small select example" 
                        onChange={handleAnswerChange}
                        value={currentAnswer}
                    >
                        {question.options.map((option, index) => (
                            <option key={index} value={option.text}>{option.text}</option>
                        ))}
                    </select>
                );
                case 'linearScale':
                    const scaleStart = question.linearScale[0].scale;
                    const scaleEnd = question.linearScale[1].scale;
                    const startLabel = question.linearScale[0].label;
                    const endLabel = question.linearScale[1].label;
                    
                    // Create an array of values from scaleStart to scaleEnd
                    const scaleValues = Array.from({ length: scaleEnd - scaleStart + 1 }, (_, i) => scaleStart + i);
                    
                    return (
                        <div className="custom-linear-scale">
                        {/* Render the start label if it exists */}
                        {startLabel && <div className="custom-scale-label">{startLabel}</div>}
                        
                        {/* Map over the scale values and render radio buttons */}
                        {scaleValues.map((value, index) => (
                            <label key={index} className="custom-scale-option">
                            <input
                                type="radio"
                                name="linearScale"
                                value={value}
                                onChange={handleAnswerChange}
                                checked={currentAnswer === String(value)}
                                className="custom-form-check-input"
                            />
                            <span className="custom-scale-option-value">{value}</span>
                            </label>
                        ))}
                    
                        {/* Render the end label if it exists */}
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
                                                onChange={(e) => handleAnswerChange(e, colIndex, rowIndex)}
                                                checked={currentAnswer === `${rowIndex}-${colIndex}`}
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
                    {currentQuestionIndex < questions.length - 1 && (
                        <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed}>Next</button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default Questions;