import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';

// Switch URLs between Server and Local hosting here
// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

const Questions = ({ triggerRefresh, selectedNestedtitle }) => {
    const [questions, setQuestions] = useState([]);
    const [questionToDelete, setQuestionToDelete] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState(null);
    const [questionsUpdated, setQuestionsUpdated] = useState(false);
    const [editUpdateToggle, setEditUpdateToggle] = useState(false);
    //
    const [clearNextQuestion, setClearNextQuestion] = useState([]);
    const [clearOptionsNextQuestion, setClearOptionsNextQuestion] = useState([]);

    // editQuestion.js refresh functionality
    const refreshQuestions = () => {
        // changing state of editUpdateToggle will trigger fetchQuestions
        if (editUpdateToggle) {
            setEditUpdateToggle(false);
        } else {
            setEditUpdateToggle(true);
        }
    };

    const deleteAction = async () => {
        if (questionToDelete) {
            try {
                const response = await fetch(`http://${destination}/api/deleteQuestion/${questionToDelete}`, { method: 'DELETE' });
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
    }

    // handleDelete component
    // nextQuestion check
    useEffect(() => {
        // declare object to contain nextQuestion and optionsNextQuestion cases
        const dataToClear = {
            questionId: questionToDelete,
            clearNextQuestionArray: clearNextQuestion,
            clearOptionsNextQuestionArray: clearOptionsNextQuestion
        }

        if (dataToClear.clearNextQuestionArray.length > 0 || dataToClear.clearOptionsNextQuestionArray.length > 0) {
      
            // debug
            console.log(`useEffect dataToClear.clearNextQuestionArray: ${JSON.stringify(dataToClear.clearNextQuestionArray)}`)
            console.log(`useEffect dataToClear.clearOptionsNextQuestionArray: ${JSON.stringify(dataToClear.clearOptionsNextQuestionArray)}`)
        
            // UPDATE request
            const updateClearNextQuestion = async (dataToClear) => {
            try {
                const response = await fetch(`http://${destination}/api/clearNextQuestion`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToClear),
                })
                if (response.ok) {
                    console.log('Data submitted successfully');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 10000);
        
                    // Trigger re-fetch in parent component questions.js
                    refreshQuestions();
                } else {
                    const errorData = await response.json();
                    console.error('Server responded with an error:', response.status, response.statusText);
                    console.error('Server error data:', errorData);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        
            // debug
            // console.log(`questionList: ${JSON.stringify(this.state.questionList)}`)
            };
        
            // Call the function to update the data in the database       
            updateClearNextQuestion(dataToClear).then(deleteAction());
        };
    }, [clearNextQuestion, clearOptionsNextQuestion, triggerRefresh]);
      
    const handleDelete = () => {
        // nextQuestion check
        let nextQuestionCheck = false;
        
        // Ensures that state is reset on each operation
        if (clearNextQuestion.length > 0 || clearOptionsNextQuestion.length > 0) {
            setClearNextQuestion([]);
            setClearOptionsNextQuestion([]);
        };
        
        // Loop through questions array
        questions.forEach((question) => {
            // This works
            if (question._id === questionToDelete) {
                // console.log(`question: ${question.question}`);
            }
            // Search for all cases for nextQuestion match
            if (question.nextQuestion === questionToDelete) {
                // debug
                console.log(`nextQuestion match: ${question.question}`)
                
                // clear logic
                setClearNextQuestion( prevClearNextQuestion =>
                    [
                        ...prevClearNextQuestion,
                        { 
                            questionId: question._id
                        }   
                    ]
                );
                nextQuestionCheck = true;
            }

            // Search for all cases for optionsNextQuestion match
            if (question.options.length > 0) {
                for(let i=0; i<question.options.length; i++) {
                    if (question.options[i].optionsNextQuestion === questionToDelete) {
                        // debug
                        console.log(`optionsNextQuestion match: ${question.question}`);

                        // clear logic
                        setClearOptionsNextQuestion( prevClearOptionsNextQuestion =>
                            [
                                ...prevClearOptionsNextQuestion,
                                { 
                                    questionId: question._id,
                                    optionsIndex: i
                                }   
                            ]
                        );
                        nextQuestionCheck = true;
                    }                        
                }
            }
        });
        
        // If passes nextQuestionCheck (when = false), then can delete straight away
        if (nextQuestionCheck === false) {
            deleteAction();
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const fetchQuestionById = async (id) => {
        try {
            const response = await fetch(`http://${destination}/api/question/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`Question with ID ${id} not found.`);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.question;
        } catch (error) {
            console.error("Error fetching specific question:", error);
            setError(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchQuestionsByNestedtitleId = async () => {
            try {
                // Assuming you receive selectedNestedtitle from props
                const nestedtitleId = selectedNestedtitle; // Use the selectedNestedtitle from props
                const response = await fetch(`http://${destination}/api/questionsByNestedtitleId/${nestedtitleId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestionsByNestedtitleId();

    }, [triggerRefresh, editUpdateToggle]);

    useEffect(() => {
        if (questions.length === 0 || questionsUpdated) return;

        const updateQuestionsWithNextTitles = async () => {
            const updatedQuestions = await Promise.all(questions.map(async (question) => {
                if (question.nextQuestion) {
                    const nextQuestionTitle = await fetchQuestionById(question.nextQuestion);
                    return { ...question, nextQuestionTitle };
                }
                return question;
            }));

            setQuestions(updatedQuestions);
        };

        updateQuestionsWithNextTitles();
        setQuestionsUpdated(true);
    }, [questions, questionsUpdated]);

    useEffect(() => {
        if (questions.length === 0 || questionsUpdated) return;
    
        const updateQuestionsWithOptionNextTitles = async () => {
            const updatedQuestions = await Promise.all(questions.map(async (question) => {
                if (question.options) {
                    const optionsWithNextTitles = await Promise.all(question.options.map(async (option) => {
                        if (option.optionsNextQuestion) {
                            const nextQuestionTitle = await fetchQuestionById(option.optionsNextQuestion);
                            return { ...option, nextQuestionTitle };
                        }
                        return option;
                    }));
                    return { ...question, options: optionsWithNextTitles };
                }
                return question;
            }));
    
            setQuestions(updatedQuestions);
        };
    
        updateQuestionsWithOptionNextTitles();
        setQuestionsUpdated(true);
    }, [questions, questionsUpdated]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!questions.length) {
        return <div>No questions available</div>;
    }

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
                    {question.firstQuestion && <h5 style={{ fontWeight: 'bold', color: 'red' }}>Question 1</h5>}
                    <h6>
                    {question.questionType === 'productInfo' ? 'Product Information' : 
                    question.questionType === 'packagingInfo' ? 'Packaging Information' : ''}
                    </h6>
                    <h4>{question.question}</h4>
                    {question.optionType === 'multipleChoice' && 
                        <div className="option-container">
                            {question.options.map((option) => (
                                <div key={option._id} className="option">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name={question.question} 
                                            value={option.text} 
                                            defaultChecked={option.isCorrect}
                                            disabled={true} 
                                            className="form-check-input"
                                        />
                                        {option.text}
                                        {option.nextQuestionTitle && <span className="next-question-title"> Next Question: {option.nextQuestionTitle}</span>}
                                    </label>
                                </div>
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
                                        className="form-check-input"
                                    />
                                    {option.text}
                                    {option.nextQuestionTitle && <span className="next-question-title"> Next Question: {option.nextQuestionTitle}</span>}
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
                                {Array.from({ length: question.linearScale[1].scale - question.linearScale[0].scale + 1 }).map((_, index) => (
                                    <div key={index} className="scale-option-horizontal">
                                        <label>{index + question.linearScale[0].scale}</label>
                                        <input 
                                            type="radio" 
                                            name={`linearScale-${question._id}`} 
                                            value={index + question.linearScale[0].scale} 
                                            disabled 
                                            className="form-check-input" 
                                        />
                                    </div>
                                ))}
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
                                        {question.grid.columns.map((column, columnIndex) => {
                                            const isCorrect = question.grid.answers.some(answer => 
                                                answer.rowIndex === rowIndex && answer.columnIndex === columnIndex && answer.isCorrect
                                            );
                                            return (
                                                <td key={columnIndex}>
                                                    <input 
                                                        type="radio" 
                                                        name={`${row.text}-${column.text}`} 
                                                        value={`${row.text}-${column.text}`}
                                                        checked={isCorrect}
                                                        disabled={true}  
                                                        className="form-check-input"
                                                    />
                                                </td>
                                            );
                                        })}
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
                                        {question.grid.columns.map((column, columnIndex) => {
                                            const isCorrect = question.grid.answers.some(answer => 
                                                answer.rowIndex === rowIndex && answer.columnIndex === columnIndex && answer.isCorrect
                                            );
                                            return (
                                                <td key={columnIndex}>
                                                    <input 
                                                        type="checkbox" 
                                                        name={`${row.text}-${column.text}`} 
                                                        value={`${row.text}-${column.text}`}
                                                        checked={isCorrect}
                                                        disabled={true}  
                                                        className="form-check-input"
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {(question.optionType === 'multipleChoiceGrid' || question.optionType === 'checkboxGrid') && (
                        <div className="form-check form-switch mt-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`requireResponseSwitch-${question._id}`}
                                checked={question.requireResponse}
                                disabled={true}  
                            />
                            <label className="form-check-label" htmlFor={`requireResponseSwitch-${question._id}`}>
                                Require a response in each row
                            </label>
                        </div>
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
                            refreshQuestions={refreshQuestions}
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
