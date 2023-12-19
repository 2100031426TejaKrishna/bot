import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';

const Questions = () => {
    const [questions, setQuestions] = useState([]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
        return new Date(dateString).toLocaleString('en-US', options);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/displayQuestions');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className="questions-container">
            {questions.map((question, index) => (
                <div key={index} className="question-card">
                    <h6>
                      {question.questionType === 'productInfo' ? 'Product Information' : 
                       question.questionType === 'packagingInfo' ? 'Packaging Information' : ''}
                    </h6>
                    <h4>{question.question}</h4>
                    {question.optionType === 'multipleChoice' && 
                        <div className="option-container">
                            {question.options.map((option) => (
                                <label key={option._id}>
                                    <input 
                                        type="radio" 
                                        name={question.question} 
                                        value={option.text} 
                                        defaultChecked={option.isCorrect}
                                        disabled={true}  
                                    />
                                    {option.text}
                                </label>
                            ))}
                        </div>
                    }
                    {question.optionType === 'checkbox' && 
                        <div className="option-container">
                            {question.options.map((option) => (
                                <label key={option._id}>
                                    <input 
                                        type="checkbox" 
                                        name={question.question} 
                                        value={option.text} 
                                        defaultChecked={option.isCorrect}
                                        disabled={true}  
                                    />
                                    {option.text}
                                </label>
                            ))}
                        </div>
                    }
                    {question.optionType === 'dropdown' &&
                        <select className="form-select form-select-sm" aria-label="Small select example" disabled>
                            {question.options.map((option, index) => (
                                <option 
                                    key={option._id} 
                                    value={option.text} 
                                    selected={option.isCorrect}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    }
                    {question.optionType === 'linear' &&
                        <div className="linear-scale">
                            <div className="scale-label">Good</div>
                            <input type="radio" name={`linearScale-${question._id}`} value="1" />
                            <input type="radio" name={`linearScale-${question._id}`} value="2" />
                            <input type="radio" name={`linearScale-${question._id}`} value="3" />
                            <input type="radio" name={`linearScale-${question._id}`} value="4" />
                            <input type="radio" name={`linearScale-${question._id}`} value="5" />
                            <div className="scale-label">Bad</div>
                        </div>
                    }
                    {question.marks && <p className="question-marks">Marks: {question.marks}</p>}
                    {question.countries && question.countries.length > 0 && (
                    <p className="question-countries">Countries: {question.countries.join(', ')}</p>
                    )}
                    {question.explanation && <p className="question-explanation">Explanation: {question.explanation}</p>}
                    <p className="question-date">Date created: {formatDate(question.date)}</p>
                    <EditQuestion />
                </div>
            ))}
        </div>
    );
};

export default Questions;
