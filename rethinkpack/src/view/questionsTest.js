import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';

const Questions = ({ triggerRefresh }) => {
    const [questions, setQuestions] = useState([]);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const handleDelete = async () => {
        if (questionToDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/deleteQuestion/${questionToDelete}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setQuestions(questions.filter(question => question._id !== questionToDelete));
                setQuestionToDelete(null);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            } catch (error) {
                console.error("Error deleting question:", error);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const fetchQuestionById = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/question/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.question; 
        } catch (error) {
            console.error("Error fetching specific question:", error);
            return null;
        }
    };


    // Implement handleEditClick
    const handleEditClick = (question) => {
        //setSelectedQuestion(question);
        // Open the modal here (you may need to add code for your modal library).

        
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
    }, [triggerRefresh]);

    useEffect(() => {
        questions.forEach(async (question) => {
            if (question.nextQuestion) {
                const nextQuestionTitle = await fetchQuestionById(question.nextQuestion);
                setQuestions((prevQuestions) =>
                    prevQuestions.map((q) => 
                        q._id === question._id ? { ...q, nextQuestionTitle } : q
                    )
                );
            }
        });
    }, [questions]);

    return (
        <div className="questions-container">
            {showToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show bg-dark text-white">
                        <div className="d-flex justify-content-between">
                            <div className="toast-body">
                                Question deleted successfully!
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
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
                    {question.optionType === 'dropdown' && (
                        <select 
                            className="form-select" 
                            aria-label="Small select example" 
                            value={question.options.find(option => option.isCorrect)?.text || ''}
                        >
                            {question.options.map((option, index) => (
                                <option 
                                    key={option._id} 
                                    value={option.text}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    )}
                    {question.optionType === 'linear' && (
                        <div className="linear-scale">
                            <div className="scale-label-left">{question.linearScale[0].label}</div>
                            <div className="scale-options-horizontal">
                                {
                                    Array.from({ length: question.linearScale[1].scale - question.linearScale[0].scale + 1 }).map((_, index) => (
                                        <label key={index} className="scale-option-horizontal">
                                            {index + question.linearScale[0].scale}
                                            <input type="radio" name={`linearScale-${question._id}`} value={index + question.linearScale[0].scale} disabled />
                                        </label>
                                    ))
                                }
                            </div>
                            <div className="scale-label-right">{question.linearScale[1].label}</div>
                        </div>
                    )}
                    {question.optionType === 'multipleChoiceGrid' && (
                        <table className="multiple-choice-grid">
                            <thead>
                                <tr>
                                    <th> </th>
                                    {question.grid.columns.map((column, columnIndex) => (
                                        <th key={columnIndex}>{column.text}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {question.grid.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{row.text}</td>
                                        {question.grid.columns.map((column, columnIndex) => (
                                            <td key={columnIndex}>
                                                <input 
                                                    type="radio" 
                                                    name={`${row.text}-${column.text}`} 
                                                    value={`${row.text}-${column.text}`}
                                                    disabled={true}  
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {question.optionType === 'checkboxGrid' && (
                        <table className="checkbox-grid">
                            <thead>
                                <tr>
                                    <th> </th>
                                    {question.grid.columns.map((column, columnIndex) => (
                                        <th key={columnIndex}>{column.text}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {question.grid.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{row.text}</td>
                                        {question.grid.columns.map((column, columnIndex) => (
                                            <td key={columnIndex}>
                                                <input 
                                                    type="checkbox" 
                                                    name={`${row.text}-${column.text}`} 
                                                    value={`${row.text}-${column.text}`}
                                                    disabled={true}  
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {question.marks && <p className="question-marks">Marks: {question.marks}</p>}
                    {question.countries && question.countries.length > 0 && (
                    <p className="question-countries">Countries: {question.countries.join(', ')}</p>
                    )}
                    {question.explanation && <p className="question-explanation">Explanation: {question.explanation}</p>}
                    {question.nextQuestionTitle && ( <p className="next-question">Next Question: {question.nextQuestionTitle}</p> )}
                    <p className="question-date">Date created: {formatDate(question.date)}</p>
                    <div className="question-actions">
                
                        <EditQuestion 
                            index = {index}
                            questionId = {question._id} 
                        />
 
                        <button 
                            className="btn btn-danger" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal"
                            onClick={() => setQuestionToDelete(question._id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this question?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={handleDelete}
                                data-bs-dismiss="modal"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questions;