import React, { useEffect, useState } from 'react';

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
            // ... existing logic to go to next question
        } else {
            alert('Please answer the current question before proceeding.');
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
        switch (question.optionType) {
            case 'multipleChoice':
                return question.options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            id={`option_${index}`}
                            name="radioGroup"
                            value={option.text}
                            onChange={handleAnswerChange}
                            checked={currentAnswer === option.text}
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                    </div>
                ));
            case 'checkbox':
                // Assuming currentAnswer is an object with boolean values for each checkbox
                return question.options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`option_${index}`}
                            name={`checkbox_${index}`}
                            value={option.text}
                            onChange={handleAnswerChange}
                            checked={currentAnswer[option.text] || false}
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                    </div>
                ));
            case 'dropdown':
                return (
                    <select
                        onChange={handleAnswerChange}
                        value={currentAnswer}
                    >
                        {question.options.map((option, index) => (
                            <option key={index} value={option.text}>{option.text}</option>
                        ))}
                    </select>
                );
            case 'linearScale':
                return (
                    <div>
                        <label>{question.linearScale[0].label}</label>
                        {[...Array(question.linearScale[1].scale - question.linearScale[0].scale + 1)].map((_, index) => (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="linearScale"
                                    value={question.linearScale[0].scale + index}
                                    onChange={handleAnswerChange}
                                    checked={currentAnswer === `${question.linearScale[0].scale + index}`}
                                />
                                {question.linearScale[0].scale + index}
                            </label>
                        ))}
                        <label>{question.linearScale[1].label}</label>
                    </div>
                );
            case 'multipleChoiceGrid':
            case 'checkboxGrid':
                // Logic for rendering grid options will be more complex and may involve a nested map
                // For simplicity, the example shows a basic structure
                return (
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {question.grid.columns.map((col, colIndex) => (
                                    <th key={colIndex}>{col.text}</th>
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
        <div>
            <div>
                <h4>{currentQuestion.question}</h4>
                {renderOptions(currentQuestion)}
            </div>
            <footer>
                <div>Question {currentQuestionIndex + 1} of {questions.length}</div>
                <button onClick={handleNextQuestion} disabled={!canProceed}>Next</button>
            </footer>
        </div>
    );
};

export default Questions;