import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userResponseMarks.css';

const UserResponseMarks = () => {
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [titles, setTitles] = useState({});
    const [scores, setScores] = useState([]);
    const [scoreDetails, setScoreDetails] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const storedResponses = localStorage.getItem('surveyResponses');
        if (storedResponses) {
            const parsedResponses = JSON.parse(storedResponses);
            setResponses(parsedResponses);

            const fetchQuestions = async () => {
                try {
                    //for server -https and change to http  for local machine

                    const allQuestionsResponse = await fetch('http://localhost:5000/api/fetchAllQuestions');
                    if (!allQuestionsResponse.ok) throw new Error(`HTTP error! status: ${allQuestionsResponse.status}`);
                    const allQuestionsData = await allQuestionsResponse.json();
                    setQuestions(allQuestionsData);

                    await Promise.all(
                        allQuestionsData.map(question => fetchTitleForQuestion(question._id))
                    );

                    calculateScores(parsedResponses, allQuestionsData);
                } catch (error) {
                    console.error("Error fetching questions:", error);
                }
            };

            fetchQuestions();
        }
    }, []);

    useEffect(() => {
        if (scores.length && Object.keys(titles).length) {
            logScoresByTitle();
        }
    }, [scores, titles]);

    const calculateScores = (responses, questions) => {
        const newScores = responses.map(response => {
            const question = questions.find(q => q._id === response.questionId);
            if (!question) return 0;

            switch (question.optionType) {
                case 'multipleChoice':
                    return question.options.some(option => option.isCorrect && option.text === response.answer) ? 1 : 0;
                case 'checkbox':
                    const correctOptions = question.options.filter(option => option.isCorrect).map(option => option.text);
                    return correctOptions.sort().toString() === response.answer.sort().toString() ? 1 : 0;
                case 'dropdown':
                    return question.options.some(option => option.isCorrect && option.text === response.answer) ? 1 : 0;
                case 'linear':
                    return response.answer ? 1 : 0;
                case 'multipleChoiceGrid':
                    if (!question.grid || !question.grid.answers) return 0;
                    const correctAnswersMCG = question.grid.answers;
                    let isCorrectMCG = true;
                    correctAnswersMCG.forEach(({ rowIndex, columnIndex, isCorrect }) => {
                        const isSelected = response.answer[rowIndex]?.includes(columnIndex) || false;
                        if (isSelected !== isCorrect) {
                            isCorrectMCG = false;
                        }
                    });
                    return isCorrectMCG ? 1 : 0;
                case 'checkboxGrid':
                    if (!question.grid || !question.grid.answers) return 0;
                    const correctAnswersCBG = question.grid.answers;
                    let isCorrectCBG = true;
                    correctAnswersCBG.forEach(({ rowIndex, columnIndex, isCorrect }) => {
                        const isSelected = response.answer[rowIndex]?.includes(columnIndex) || false;
                        if (isSelected !== isCorrect) {
                            isCorrectCBG = false;
                        }
                    });
                    return isCorrectCBG ? 1 : 0;
                case 'openEnded':
                    return question.options.some(option => option.text.trim().toLowerCase() === response.answer.trim().toLowerCase()) ? 1 : 0;
                default:
                    return 0;
            }
        });
        setScores(newScores);
    };

    const fetchTitleForQuestion = async (questionId) => {
        try {
            //for server -https and change to http  for local machine

            const response = await fetch(`http://localhost:5000/api/fetchTitleForQuestion/${questionId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const { title, subtitle, nestedTitle } = await response.json();
            const fullTitle = `${title}`;
            setTitles((prevTitles) => ({ ...prevTitles, [questionId]: fullTitle }));
        } catch (error) {
            console.error("Error fetching title for question:", error);
        }
    };

    const logScoresByTitle = () => {
        const scoresByTitle = {};
        const questionsCountByTitle = {};
        const newScoreDetails = {};

        responses.forEach((response, index) => {
            const title = titles[response.questionId];
            const score = scores[index];

            if (!scoresByTitle[title]) {
                scoresByTitle[title] = [];
                questionsCountByTitle[title] = 0;
            }

            scoresByTitle[title].push(score);
            questionsCountByTitle[title]++;
        });

        Object.entries(scoresByTitle).forEach(([title, scores]) => {
            const sumOfScores = scores.reduce((acc, score) => acc + score, 0);
            const totalQuestions = questionsCountByTitle[title];
            const percentage = totalQuestions ? ((sumOfScores / totalQuestions) * 100).toFixed(2) : 0;
            newScoreDetails[title] = { sumOfScores, totalQuestions, percentage };
        });

        setScoreDetails(newScoreDetails);
    };

    const getQuestion = (questionId) => {
        return questions.find(q => q._id === questionId);
    };

    const renderOptions = (question, answer) => {
        if (!question) return null;
        switch (question.optionType) {
            case 'multipleChoice':
                return question.options.map((option, index) => (
                    <div key={index} style={{ color: option.isCorrect ? 'green' : 'black' }}>
                        <input
                            type="radio"
                            id={`option_${index}`}
                            value={option.text}
                            checked={answer === option.text}
                            disabled
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                        {option.isCorrect && <span className="correct-answer"> (Correct Answer)</span>}
                    </div>
                ));
            case 'checkbox':
                return question.options.map((option, index) => (
                    <div key={index} style={{ color: option.isCorrect ? 'green' : 'black' }}>
                        <input
                            type="checkbox"
                            id={`option_${index}`}
                            value={option.text}
                            checked={Array.isArray(answer) && answer.includes(option.text)}
                            disabled
                        />
                        <label htmlFor={`option_${index}`}>{option.text}</label>
                        {option.isCorrect && <span className="correct-answer"> (Correct Answer)</span>}
                    </div>
                ));
            case 'dropdown':
                return (
                    <div>
                        <select
                            className="form-select"
                            aria-label="Dropdown select example"
                            value={answer || "placeholder"}
                            disabled
                        >
                            <option value="placeholder" disabled hidden>Select an option</option>
                            {question.options.map((option, index) => (
                                <option key={index} value={option.text}>{option.text}</option>
                            ))}
                        </select>
                        {question.options.filter(option => option.isCorrect).map((option, index) => (
                            <p key={index} className="correct-answer">Correct Answer: {option.text}</p>
                        ))}
                    </div>
                );
                case 'linear':
            const scaleStart = question.linearScale[0].scale;
            const scaleEnd = question.linearScale[1].scale;
            const startLabel = question.linearScale[0].label;
            const endLabel = question.linearScale[1].label;

            const scaleValues = Array.from({ length: scaleEnd - scaleStart + 1 }, (_, i) => scaleStart + i);

            return (
                <>
                <div className="custom-linear-scale">
                    {startLabel && <div className="custom-scale-label">{startLabel}</div>}
                    {scaleValues.map((value, index) => (
                        <div key={index} className={`custom-scale-option ${answer === String(value) ? 'green-radio' : ''}`}>
                            <input
                                type="radio"
                                name="linearScale"
                                value={value}
                                checked={answer === String(value)}
                                disabled
                            />
                            <span className="custom-scale-option-value">{value}</span>
                        </div>
                    ))}
                    {endLabel && <div className="custom-scale-label">{endLabel}</div>}
                </div>
                                    <p>Selected Answer: {answer}</p>
               </>
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
                                        <td key={colIndex} style={{ backgroundColor: question.grid.answers.some(ans => ans.rowIndex === rowIndex && ans.columnIndex === colIndex && ans.isCorrect) ? 'green' : 'transparent' }}>
                                            <input
                                                type={question.optionType === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                                                name={question.optionType === 'multipleChoiceGrid' ? `row_${rowIndex}` : `row_${rowIndex}_col_${colIndex}`}
                                                value={`${rowIndex}-${colIndex}`}
                                                checked={Array.isArray(answer[rowIndex]) && answer[rowIndex].includes(colIndex)}
                                                disabled
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                case 'openEnded':
                    const correctAnswer = question.options.find(option => true)?.text || "No correct answer provided";
                    return (
                        <div>
                            <textarea
                                className="form-control"
                                value={answer}
                                disabled
                            />
                            <p className="correct-answer">Correct Answer: {correctAnswer}</p>
                        </div>
                    );
            case 'countrySelect':
                return (
                    <div>
                        <select
                            className="form-select"
                            aria-label="Country select example"
                            value={answer || "placeholder"}
                            disabled
                        >
                            <option value="placeholder" disabled hidden>Select a country</option>
                            {question.options.map((option, index) => (
                                <option key={index} value={option.text}>{option.text}</option>
                            ))}
                        </select>
                        {question.options.filter(option => option.isCorrect).map((option, index) => (
                            <p key={index} className="correct-answer">Correct Answer: {option.text}</p>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const totalScore = scores.reduce((acc, score) => acc + score, 0);
    const totalQuestions = responses.length;
    const percentage = totalQuestions ? ((totalScore / totalQuestions) * 100).toFixed(2) : 0;

    if (!responses.length) {
        return <div>No responses found.</div>;
    }

    return (
        <div className="result-page">
            <div className="header">
                <h1>Result</h1>
            </div>
            <div className="container">
                <div className="score-section">
                    <div className="score-card">
                        <div className="score-info">
                            <h2>Score: {totalScore}</h2>
                        </div>
                        <div className="gap"></div> {/* Add a gap */}
                        <div className="percentage-container">
                            <div className="label">Percentage</div>
                            <div className="circular-progress" style={{ background: `conic-gradient(rgb(84, 222, 15) ${percentage}%, #e53d3d ${percentage}%)` }}>
                                <span className="percentage">{percentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Displaying score details */}
            <div className="container">
                <div className="score-section">
            <div className="score-details">
                <h2>Score Details</h2>
                {Object.entries(scoreDetails).map(([title, details]) => (
                    <div key={title}>
                        <p>Title: {title}</p>
                        <p>Score: {details.sumOfScores}/{details.totalQuestions}</p>
                        <p>Percentage: {details.percentage}%</p>
                    </div>
                ))}
            </div>
            </div>
            </div>
            <div className="questions-heading">
                <h2>Assessment Details</h2>
            </div>
            <div className="responses-container">
                <ul className="responses-list">
                    {responses.map((response, index) => {
                        const question = getQuestion(response.questionId);
                        return (
                            <li key={response.questionId} className="response-item">
                                <h3 className="response-title">{question && titles[response.questionId]}</h3>
                                <h4>{index + 1}. {question ? question.question : 'Unknown Question'}</h4>
                                {question && renderOptions(question, response.answer)}
                                <p>Score: {scores[index]}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default UserResponseMarks;
