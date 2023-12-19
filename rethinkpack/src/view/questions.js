import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleDeleteClick = (questionId) => {
        setSelectedQuestion(questionId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async (questionId) => {
        setIsModalOpen(false);
        try {
            await fetch(`http://localhost:5000/api/deleteQuestion/${questionId}`, { method: 'DELETE' });
            setQuestions(questions.filter(question => question._id !== questionId));
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

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

    const ConfirmModal = ({ isOpen, onClose, onConfirm, question }) => {
        if (!isOpen) return null;
      
        return (
          <div className="modal-backdrop">
            <div className="modal">
              <h4>Delete Question</h4>
              <p>Are you sure you want to delete this question?</p>
              <button onClick={onClose}>Cancel</button>
              <button onClick={() => onConfirm(question)}>Confirm</button>
            </div>
          </div>
        );
      };

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
                    <p className="question-date">Date created: {formatDate(question.date)}</p>
                    <div className="question-actions">
                        <EditQuestion />
                        <button 
                            className="btn btn-dark" 
                            onClick={() => handleDeleteClick(question._id)}>
                            Delete
                        </button>
                        <ConfirmModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={handleConfirmDelete}
                            question={selectedQuestion}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Questions;
