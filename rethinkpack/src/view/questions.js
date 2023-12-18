import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion.js';
// import axios from 'axios';

const Questions = () => {
    // const [questions, setQuestions] = useState([]);

    // useEffect(() => {
    //     const fetchQuestions = async () => {
    //         try {
    //             const response = await axios.get('/api/questions'); 
    //             setQuestions(response.data);
    //         } catch (error) {
    //             console.error('Error fetching questions:', error);
    //         }
    //     };

    //     fetchQuestions();
    // }, []);

    const questions = [
        {
            questionType: "productInfo",
            question: "What is the colour for grass?",
            optionType: "multipleChoice",
            options: [
                { text: "Black", isCorrect: false, _id: "657c16e257c07bab7da8397a" },
                { text: "Green", isCorrect: true, _id: "657c16e257c07bab7da8397b" },
                { text: "Purple", isCorrect: false, _id: "657c16e257c07bab7da8397c" }
            ],
            date: "2023-12-15T09:05:38.292+00:00"
        }
    ];

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
        <div className="questions-container">
            {questions.map((question, index) => (
                <div key={index} className="question-card">
                    <h3>{question.question}</h3>
                    {question.optionType === 'multipleChoice' && 
                        question.options.map((option, idx) => (
                            <label key={option._id}>
                                <input type="radio" name={question.question} value={option.text} defaultChecked={option.isCorrect} />
                                {option.text}
                            </label>
                        ))
                    }
                    <p className="question-date">{formatDate(question.date)}</p>
                    <EditQuestion />
                </div>
            ))}
        </div>
    );
};

export default Questions;
