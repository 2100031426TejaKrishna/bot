import React, { useEffect, useState } from 'react';
import './questions.css';
import EditQuestion from './editQuestion';
import duplicateQuestion from './duplicateQuestion'; // Import the duplicate function


// Switch URLs between Server and Local hosting here
const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

const Questions = (triggerRefresh ) => {       //
    const [questions, setQuestions] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const [scores,setScores] = useState([]);
    const [score, setScore] = useState(0);
    const [checkscore, setCheckScore] = useState(0);
    const [refreshPage, setRefreshPage] = useState(false);
    const [checkboxSelections, setCheckboxSelections] = useState({});
    const [selectedOption, setSelectedOption] = useState({});
    const [questionToDelete, setQuestionToDelete] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState(null);
    const [questionsUpdated, setQuestionsUpdated] = useState(false);
    const [editUpdateToggle, setEditUpdateToggle] = useState(false);
    const [clearNextQuestion, setClearNextQuestion] = useState([]);
    //const [clearPreviousQuestion, setClearPreviousQuestion] = useState([]);
    const [clearOptionsNextQuestion, setClearOptionsNextQuestion] = useState([]);
    // const [clearOptionsPreviousQuestion, setClearOptionsPreviousQuestion] = useState([]);
    const [duplicateMessage, setDuplicateMessage] = useState('');
   
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedLinearScale, setSelectedLinearScale] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [selectedAnswersCheck, setSelectedAnswersCheck] = useState([]);
    const rearrangeQuestions = (questions) => {

        const questionMap = new Map();
        questions.forEach((question) => questionMap.set(question._id, question));
      
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          if (question.nextQuestion && questionMap.has(question.nextQuestion)) {
            const nextQuestionId = question.nextQuestion;
            const nextQuestionIndex = questions.findIndex((q) => q._id === nextQuestionId);
            if (nextQuestionIndex!== -1 && nextQuestionIndex!== i) {
              questions.splice(nextQuestionIndex, 0, questions.splice(i, 1)[0]);
            //   questions.splice(i, 1);
            //   i--;
            }
          }
        }
        console.log(questions);

        return questions;

      };
      
      
    const findQuestionById = (_id) => {
        return questions.find(q => q._id === _id);
    };
    
    const logQuestionDetails = (question) => {
        const nextQuestion = findQuestionById(question.nextQuestionId);
        const questionDetails = {
            ...question,
            nextQuestion
        };
        console.log(questionDetails);
    };

     
    const handleRadioChange = (rowIndex, columnIndex, question) => {
        setSelectedAnswersCheck(prevSelectedAnswers => {
          // Find and remove any existing answer for the same row to enforce radio behavior
          const filteredAnswers = prevSelectedAnswers.filter(answer => answer.rowIndex !== rowIndex);
      
          // Add the new answer only if it's different from the previous one
          const existingAnswer = prevSelectedAnswers.find(answer =>
            answer.rowIndex === rowIndex && answer.columnIndex === columnIndex
          );
      
          let updatedSelectedAnswers = [...filteredAnswers];
          if (!existingAnswer) {
            updatedSelectedAnswers.push({ rowIndex, columnIndex });
          }
      
          // Log the current selection
          console.log('Current Selection', { rowIndex, columnIndex });
      
          console.log('Selected Answers:', updatedSelectedAnswers);
          calculateCheckScore(updatedSelectedAnswers, question);
      
          return updatedSelectedAnswers;
        });
      };
    const handleCheckboxChange = (rowIndex, columnIndex,question) => {
        setSelectedAnswers(prevSelectedAnswers => {
            const answerIndex = prevSelectedAnswers.findIndex(answer => 
                answer.rowIndex === rowIndex && answer.columnIndex === columnIndex
            );

            let updatedSelectedAnswers;
            if (answerIndex >= 0) {
                // Remove the existing answer
                updatedSelectedAnswers = prevSelectedAnswers.filter((_, idx) => idx !== answerIndex);
            } else {
                // Add new answer
                updatedSelectedAnswers = [...prevSelectedAnswers, { rowIndex, columnIndex }];
            }

            console.log('Selected Answers:', updatedSelectedAnswers);
            calculateScore(updatedSelectedAnswers,question);
            return updatedSelectedAnswers;
        });
    };
    const calculateScore = (selectedAnswers,question) => {
        const originalAnswers = question.grid.answers.filter(answer => answer.isCorrect);
        const isAllCorrect = originalAnswers.every(answer =>
            selectedAnswers.some(selected =>
                selected.rowIndex === answer.rowIndex && selected.columnIndex === answer.columnIndex
            )
        );

        const hasExtraSelections = selectedAnswers.some(selected =>
            !originalAnswers.some(answer =>
                selected.rowIndex === answer.rowIndex && selected.columnIndex === answer.columnIndex
            )
        );

        if (isAllCorrect && !hasExtraSelections) {
            setScore(1);
        } else {
            setScore(0);
        }
    };

    const calculateCheckScore = (selectedAnswers,question) => {
        const originalAnswers = question.grid.answers.filter(answer => answer.isCorrect);
        const isAllCorrect = originalAnswers.every(answer =>
            selectedAnswers.some(selected =>
                selected.rowIndex === answer.rowIndex && selected.columnIndex === answer.columnIndex
            )
        );

        const hasExtraSelections = selectedAnswers.some(selected =>
            !originalAnswers.some(answer =>
                selected.rowIndex === answer.rowIndex && selected.columnIndex === answer.columnIndex
            )
        );

        if (isAllCorrect && !hasExtraSelections) {
            setCheckScore(1);
        } else {
            setCheckScore(0);
        }
    };


const handleLinearScaleChange = (event) => {
    setSelectedLinearScale(event.target.value);
};

    const handleCheck = (isChecked, option, questionIndex) => {
        setSelectedOptions((prevSelectedOptions) => {
            let updatedSelectedOptions = [];
            if (isChecked) {
                // Add the option to the selectedOptions array with isCorrect property based on all options
                updatedSelectedOptions = [...prevSelectedOptions, { ...option, isCorrect: option.isCorrect }];
            } else {
                // Remove the option from the selectedOptions array
                updatedSelectedOptions = prevSelectedOptions.filter(opt => opt._id !== option._id);
            }
    
            // Retrieve the current question
            const currentQuestion = questions[questionIndex];
            if (!currentQuestion || !currentQuestion.options) {
                // If currentQuestion or its options are not defined, return the previous selectedOptions
                return prevSelectedOptions;
            }
    
            // Calculate the score based on the updatedSelectedOptions
            const selectedIsCorrectCount = updatedSelectedOptions.filter(opt => opt.isCorrect).length;
            const allIsCorrectCount = currentQuestion.options.filter(opt => opt.isCorrect).length;
            const score = selectedIsCorrectCount === allIsCorrectCount && updatedSelectedOptions.filter(opt => !opt.isCorrect).length === 0 ? 1 : 0;
    
            // Update the scores state
            const newScores = [...scores];
            newScores[questionIndex] = score;
            setScores(newScores);
    
            console.log('Selected Options:', updatedSelectedOptions.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })));
            console.log('Score:', score);
    
            return updatedSelectedOptions;
        });
    };
    
    
    

    
    const optionClicked = (questionIndex, isCorrect) => {
        const newScores = [...scores];
        newScores[questionIndex] = isCorrect ? 1 : 0;
        setScores(newScores);
    };
   
   

    // editQuestion.js refresh functionality
    const refreshQuestions = () => {
        // changing state of editUpdateToggle will trigger fetchQuestions
        if (editUpdateToggle) {
            setEditUpdateToggle(false);
        } else {
            setEditUpdateToggle(true);
        }
    };

    const saveDuplicateQuestion = async (question) => {
        try {
            // console.log(JSON.stringify({question}));

            const response = await fetch(`http://${destination}/api/duplicateQuestion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }), // Send the question data to the backend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Duplicate question saved:', data);
    
            // For example, show a success toast message
            setDuplicateMessage('Duplicate question created!'); // Display the message
            setTimeout(() => setDuplicateMessage(''), 3000); // Clear the message after 3 seconds
    
            // Trigger a refresh of the questions list if needed
            refreshQuestions();
        } catch (error) {
            console.error('Error saving duplicate question:', error);
        }
    };

        const handleDuplicate = (question) => {
            const duplicatedQuestion = duplicateQuestion(question); // Call the duplicate function
            setQuestions([...questions, duplicatedQuestion]); // Add the duplicated question to the questions array
            setDuplicateMessage('Duplicate question created!'); // Display the message
            setTimeout(() => setDuplicateMessage(''), 3000); // Clear the message after 3 seconds
            
            // Save the duplicate question to the database
            saveDuplicateQuestion(duplicatedQuestion);
        
            window.location.reload();
           
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
            //clearPreviousQuestionArray: clearPreviousQuestion,
            clearOptionsNextQuestionArray: clearOptionsNextQuestion,
            //clearOptionsPreviousQuestionArray: clearOptionsPreviousQuestion
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
    }, [clearNextQuestion, clearOptionsNextQuestion,triggerRefresh]); //trigger
     
   //testing
   const logQuestionsWithNextQuestion = () => {
    // Filter out questions with nextQuestion
    const questionsWithNextQuestion = questions.filter(question => question.nextQuestion);

    // Iterate through each question and log its details
    questionsWithNextQuestion.forEach(question => {
        console.log("Question details:");
        console.log("Question ID:", question._id);
        console.log("Question:", question.question);
        console.log("Next Question ID:", question.nextQuestion);
        // Log other details as needed
        console.log("----------------------------------");
    });
};


    
    const handleDelete = () => {
        // nextQuestion check
        let nextQuestionCheck = false;
        // let previousQuestionCheck = false;

        // Ensures that state is reset on each operation
        if (clearNextQuestion.length > 0 || clearOptionsNextQuestion.length > 0) {
            setClearNextQuestion([]);
            setClearOptionsNextQuestion([]);
        };
        // if (clearPreviousQuestion.length > 0 || clearOptionsPreviousQuestion.length > 0) {
        //     setClearPreviousQuestion([]);
        //     setClearOptionsPreviousQuestion([]);
        // };

        // Loop through questions array
        questions.forEach((question) => {
            // This works
            if (question._id === questionToDelete) {
                // console.log(`question: ${question.question}`);
            }
            // Search for all cases for nextQuestion match
            if (question.nextQuestion === questionToDelete) {
                // debug
                console.log(`nextQuestion match: ${question.question}`);

                // clear logic
                setClearNextQuestion(prevClearNextQuestion => [
                    ...prevClearNextQuestion,
                    {
                        questionId: question._id
                    }
                ]);
                nextQuestionCheck = true;
            }

            // Search for all cases for optionsNextQuestion match
            if (question.options?.length > 0) { // Ensure question.options is not null or undefined
                for (let i = 0; i < question.options.length; i++) {
                    if (question.options[i].optionsNextQuestion === questionToDelete) {
                        // debug
                        console.log(`optionsNextQuestion match: ${question.question}`);

                        // clear logic
                        setClearOptionsNextQuestion(prevClearOptionsNextQuestion => [
                            ...prevClearOptionsNextQuestion,
                            {
                                questionId: question._id,
                                optionsIndex: i
                            }
                        ]);
                        nextQuestionCheck = true;
                    }
                }
            }
        });
        if (nextQuestionCheck === false) {
            deleteAction();
        }
        // if(previousQuestionCheck ===false){
        //     deleteAction();
        // }
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
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://${destination}/api/displayQuestions`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // setQuestions(data);
                const rearrangedQuestions = rearrangeQuestions(data);
                setQuestions(rearrangedQuestions);
                setRefreshPage(true);
                setScores(Array(data.length).fill(0));
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
        if(refreshPage){
            window.location.reload();
            setRefreshPage(false);
        }

    }, [triggerRefresh,editUpdateToggle]); //trigger

    // useEffect(() => {
    //     if (questions.length === 0 || questionsUpdated) return;

    //     const updateQuestionsWithNextTitles = async () => {
    //         const updatedQuestions = await Promise.all(questions.map(async (question) => {
    //             if (question.nextQuestion) {
    //                 const nextQuestionTitle = await fetchQuestionById(question.nextQuestion);
    //                 return { ...question, nextQuestionTitle };
    //             }
    //             return question;
    //         }));

    //         setQuestions(updatedQuestions);
    //     };

    //     updateQuestionsWithNextTitles();
    //     setQuestionsUpdated(true);
    // }, [questions, questionsUpdated]);
   
    
    // using a single useeffect for both next and previous question helps 
    useEffect(() => {
        if (questions.length === 0 || questionsUpdated) return;
    
        const updateQuestionsWithTitles = async () => {
            const updatedQuestions = await Promise.all(questions.map(async (question) => {
                let nextQuestionTitle = '';
                //let previousQuestionTitle = '';
    
                if (question.nextQuestion) {
                    nextQuestionTitle = await fetchQuestionById(question.nextQuestion);
                }
    
                // if (question.previousQuestion) {
                //     previousQuestionTitle = await fetchQuestionById(question.previousQuestion);
                // }
    
                return { ...question, nextQuestionTitle
                };
            }));
            
    
            setQuestions(updatedQuestions);
            setQuestionsUpdated(true);
            logQuestionsWithNextQuestion();

        };
    
        updateQuestionsWithTitles();
    }, [questions, questionsUpdated]);
   

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!questions.length) {
        return <div>No questions available</div>;
    }

   

    return (
        

<div className="questions-container">
    
    {duplicateMessage && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className="toast show bg-dark text-white">
                <div className="d-flex justify-content-between">
                    <div className="toast-body">
                        {duplicateMessage}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setDuplicateMessage('')}></button>
                </div>
            </div>
        </div>
    )}
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
                    {/* Render question details based on optionType */}
                    {question.optionType === 'multipleChoice' && 
                        <div className="option-container">
                            {question.options && question.options.map((option, optionIndex) => (
                                //  console.log(option)
                                <div key={option._id} className="option">
                                    <label>
                                         <input 
                                            type="radio" 
                                            name={question.question} 
                                            value={option.text} 
                                            // defaultChecked={option.isCorrect}
                                            // disabled={true} 
                                            onChange={() => optionClicked(index,option.isCorrect)} 
                                
                                            className="form-check-input"
                                        /> 
                                        
                                        {option.text} 
                                       <p>{option.recommendation}</p> 
                                        {/* <p>hint: <RecommendationComponent /></p> */}
                                                                        
                                        {option.nextQuestionTitle && <span className="next-question-title"> Question After this... {option.nextQuestionTitle}</span>}
                                        {/* {option.previousQuestionTitle && <span className='previous-question-title'>Previous Question: {option.previousQuestionTitle}</span>} */}
                                    </label>
                                    
                                </div>
                            ))}
                            
                            <p>Score: {scores[index]}</p>

                        </div>
                    }
                    {/* Additional code for other option types */}                                             
                     {question.optionType === 'checkbox' && 
                        <div className="option-container">
                            {/* {console.log("before checking:", question.options)} */}
                            {question.options && question.options.map((option,optionIndex) => (
                                <label key={option._id}>
                                     <input 
                                        type="checkbox" 
                                        name={question.question} 
                                        value={option.text} 
                                        // defaultChecked={option.isCorrect}
                                        // disabled={true}  
                                        // onChange={(e) =>{ handleCheck(e.target.checked, option);

                                        // } }

                                        onChange={(e) => { 
                                            handleCheck(e.target.checked, option,index); 
                                            if (e.target.checked) { // Only log when checkbox is checked
                                                console.log('All Options (assuming all selected):', question.options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })));
                                            }
                                        }}
                                        className="form-check-input"
                                    /> 
                                    
                                    
                                    {option.text}
                                    <p>  hint: {option.recommendation}</p>
                                    {option.nextQuestionTitle && <span className="next-question-title">Question After this... {option.nextQuestionTitle}</span>}
                                </label>
                            ))}
                                {/* {console.log('All Options (assuming all selected):', question.optionType === 'checkbox'&& question.question && question.options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })))} */}

                                <p>Score:{scores[index]} </p>

                        </div>
                    } 
                   
                     
    
                    {question.optionType === 'dropdown' && (
                            <>
                                 <select 
                                    className="form-select" 
                                    aria-label="Small select example" 
                                    value={selectedOption[question._id] || ''}
                                    onChange={(e) => {
                                             const selectedOptionText = e.target.value;
                                             const selectedOptionIndex = question.options.findIndex(option => option.text === selectedOptionText);

                                            setSelectedOption(prev => ({ ...prev, [question._id]: selectedOptionText }));
                                            const newScores = [...scores];
                                            const isCorrect = question.options[selectedOptionIndex]?.isCorrect;
                                            setScores(newScores);
                                            newScores[index] = isCorrect ? 1 : 0;
                                                }}
                                  >
                                 <option value="" disabled>Select an option</option>
                                        {question.options.map((option, index) => (
                                            <option key={option._id} value={option.text}>
                                                    {option.text}
                                 </option>
                                    ))}
                                </select>
                                                             <p>Score: {scores[index]}</p>
                             </>
)                   }


{question.optionType === 'linear' && (
    <>
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
                        onChange={handleLinearScaleChange} 
                        className="form-check-input" 
                    />
                </div>
            ))}
        </div>
        <div className="scale-label-right">{question.linearScale[1].label}</div>
        <br></br>
        
    </div>
    {selectedLinearScale !== null && (
        <div className="selected-answer">
            Selected Scale: {selectedLinearScale}
        </div>
    )}
       </>
)} 
     <>
  {question.optionType === 'multipleChoiceGrid' && (
    <table className="multiple-choice-grid">
      <thead>
        <tr>
          <th></th>
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
              const isSelected = selectedAnswersCheck.some(
                answer =>
                  answer.rowIndex === rowIndex && answer.columnIndex === columnIndex
              );
              return (
                <td key={columnIndex}>
                  <input
                    type="radio"
                    name={`row-${rowIndex}`}
                    value={`${row.text}-${column.text}`}
                    checked={isSelected}
                    onChange={() => {
                      handleRadioChange(rowIndex, columnIndex, question);
                      console.log("Original Answers:", question.grid.answers);
                    }}
                    className="form-check-input"
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <p>Score: {checkscore}</p>

    </table>
  )}
</>
               <>
               {question.optionType === 'checkboxGrid' && (
                <table className="checkbox-grid">
                    <thead>
                        <tr>
                            <th></th>
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
                                    const isSelected = selectedAnswers.some(answer => 
                                        answer.rowIndex === rowIndex && answer.columnIndex === columnIndex
                                    );
                                    return (
                                        <td key={columnIndex}>
                                            <input 
                                                type="checkbox" 
                                                name={`${row.text}-${column.text}`} 
                                                value={`${row.text}-${column.text}`}
                                                checked={isSelected}
                                                onChange={() => {handleCheckboxChange(rowIndex, columnIndex,question) ;
                                                    console.log("Original Answers:" ,question.grid.answers);

                                                }}  
                                                className="form-check-input"
                                            />
                                        </td>

                                    );

                                })}
                            </tr>
                        ))}
                    </tbody>
                    <p>Score: {score}</p>

                </table>
            )}

            </>
                   
                    {question.optionType === 'openEnded' && (
    <div className="option-container">
        <textarea
            className="form-textarea"
            aria-label="Open-ended input"
            value={selectedOption[question._id] || ''}
            onChange={(e) => {
                const inputText = e.target.value;
                setSelectedOption(prev => ({ ...prev, [question._id]: inputText }));
            }}
            placeholder="Type your answer here"
        />
        <button
            className="submit-button"
            onClick={() => {
                const inputText = (selectedOption[question._id] || '').trim();
                const newScores = [...scores];
                const isCorrect = question.options.some(option => option.text.trim().toLowerCase() === inputText.toLowerCase());
                newScores[index] = isCorrect ? 1 : 0;
                setScores(newScores);
                setShowResults(true); // Set a flag to show results after submission
            }}
        >
            Enter
        </button>
        {showResults && (
            <div>
                <p>Score: {scores[index]}</p>
                {question.options && question.options.map((option) => (
                    <div key={option._id} className="option">
                        <label>
                            Answer :{option.text}
                            <p>{option.recommendation}</p>
                            {option.nextQuestionTitle && <span className="next-question-title">Question After this... {option.nextQuestionTitle}</span>}
                        </label>
                    </div>
                ))}
            </div>
        )}
    </div>
)}


                    {/* Include marks, country, explanation, and other details */}
                    {/* <p>Score: {score}</p> */}
                    {/* <button onClick={calculateScore}>Marks</button> */}
 
                    {question.marks && <p className="question-marks">Marks: {question.marks}</p>}
                    {question.country && question.country.selectedCountry && (
                        <p className="question-country">Country: {question.country.selectedCountry}</p>
                        
                    )}
                    {/* { question.countries  && (
                        <p className="question-country">Countries: {question.countries.join(', ')}</p>
                        
                        
                    )} */}
                    {question.countries && question.countries.length > 0 ? (
                                   <p className="question-country">Countries: {question.countries.join(', ')}</p>
                                                                        ) : (
                                    <p className="question-country"> </p>
                            )}

                    
                    {question.explanation && <p className="question-explanation">Explanation: {question.explanation}</p>}
                    {/* Render "Next Question" details if applicable */}
                    {question.nextQuestionTitle && <p className="next-question">Question After this... {question.nextQuestionTitle}</p>}
                 
                    {/* render "Previous Question" details if applicable */}
                    {/* {question.previousQuestionTitle && <p className='previous-question'>Previous Question: {question.previousQuestionTitle}</p>} */}
                    {/* {previousQuestionTitle && <p className='previous-question'>Previous Question: {previousQuestionTitle}</p>} */}
                    {/* Render date created */}
                    <p className="question-date">Date created: {formatDate(question.date)}</p>
                    {/* Render question actions */}
                    <div className="question-actions">
                        <EditQuestion 
                            index={index}
                            questionId={question._id} 
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
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => handleDuplicate(question)} // Duplicate button
                        >
                            Duplicate
                        </button>
                        {/* <button 
                            className="btn btn-info" 
                            onClick={() => logQuestionDetails(question)}
                        >
                            Log Details
                        </button> */}
                    </div>
                </div>
            ))}

            
        
            {/* Modal for confirmation */}
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

                
}
export default Questions;
