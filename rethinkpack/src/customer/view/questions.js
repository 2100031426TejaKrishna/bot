import React, { useEffect, useState, useRef } from 'react';
import './questions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Questions = () => {
  const [isFinal,setFinal] = useState(false)
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [gridAnswers, setGridAnswers] = useState({});
  const [openEndedText, setOpenEndedText] = useState('');
  const [openEndedWordLimit, setOpenEndedWordLimit] = useState(500);
  const [isWordCountExceeded, setIsWordCountExceeded] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [questionFlow, setQuestionFlow] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCountrySelectionModal, setShowCountrySelectionModal] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [showCountrySelection, setShowCountrySelection] = useState(false);
  const [currentStage, setCurrentStage] = useState('general');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState({});
  const [currentTitle, setCurrentTitle] = useState('');
  const [countryQuestions, setCountryQuestions] = useState([]);
  const [titles, setTitles] = useState({});
  const [dynamicQuestions, setDynamicQuestions] = useState({});
  const [addedQuestions, setAddedQuestions] = useState({});
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [questionStack, setQuestionStack] = useState([]);
  const [visitedStack, setVisitedStack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentquestion,setcurrentquestion] = useState({});
  const [showFinalModal,setshowFinalModal] = useState(false);
  const [countryFinal,setcountryFinal] = useState(false);
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
    "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
    "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
    "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
    "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
  ];


 
  const countryRefs = useRef(countries.reduce((acc, country) => {
    acc[country] = React.createRef();
    return acc;
  }, {}));

  const navigate = useNavigate();
  const destination = "localhost:5000"; // Ensure this is the correct backend URL

  // useEffect(()=>{
  //   if(currentquestion.islastQuestion === false){
  //     setShowCountrySelection(false);
  //   }
  // },[currentquestion])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://${destination}/api/fetchQuestionsSeries`);
        const data = await response.json();
        console.log(data)
        const { independentQuestions } = data;

        setQuestions(independentQuestions);
        setQuestionFlow(independentQuestions.map(question => ({ ...question, isVisible: true })));
        console.log(questionFlow);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [destination]);

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem('surveyResponses'));
    const lastQuestionIndex = parseInt(localStorage.getItem('lastQuestionIndex'), 10);
    if (savedResponses) {
      setAnswers(savedResponses);
    }
    if (!isNaN(lastQuestionIndex)) {
      setCurrentQuestionIndex(lastQuestionIndex);
    }
  }, []);
  

  useEffect(() => {
    const fetchTitle = async (questionId) => {
      setIsTitleLoading(true);
      try {
        const response = await fetch(`http://${destination}/api/fetchTitleForQuestion/${questionId}`);
        const data = await response.json();
        setTitles((prevTitles) => ({
          ...prevTitles,
          [questionId]: data
        }));
      } catch (error) {
        console.error("Error fetching title:", error);
      } finally {
        setIsTitleLoading(false);
      }
    };

    if (questions.length > 0) {
      setQuestionStack(prevStack => {
        if (prevStack.length === 0 || prevStack[prevStack.length - 1].questionId !== currentQuestion?._id) {
            return [...prevStack, { questionId: currentQuestion?._id }];
        }
        return prevStack;
    });

      const currentQuestion = questions[currentQuestionIndex];
      setQuestionStack(questionStack);
      if (!currentQuestion) {
        setCurrentTitle('');
        return;
      }

      const prevAnswer = answers[currentQuestion._id];
      if (prevAnswer) {
        if (Array.isArray(prevAnswer)) {
          setSelectedOptions(prevAnswer);
          setCanProceed(prevAnswer.length > 0);
        } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
          setGridAnswers(prevAnswer);
          const isValid = validateGridAnswersWithTempAnswers(prevAnswer, currentQuestion);
          setCanProceed(isValid);
        } else {
          setCurrentAnswer(prevAnswer);
          setOpenEndedText(prevAnswer);
          setCanProceed(prevAnswer?.trim() !== '');
        }
      } else if (currentQuestion.optionType === 'openEnded') {
        setOpenEndedText(prevAnswer || '');
        setCanProceed(!!prevAnswer && prevAnswer.trim().length > 0);
      } else {
        setCurrentAnswer('');
        setSelectedOptions([]);
        setGridAnswers({});
        setOpenEndedText('');
        setCanProceed(false);
      }

      if (currentQuestion.options) {
        currentQuestion.options.forEach(async (option) => {
          try {
            const response = await fetch(`http://${destination}/api/recommendationText/${option._id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const { recommendations } = await response.json();
            setRecommendations((prevRecommendations) => ({
              ...prevRecommendations,
              [option._id]: recommendations
            }));
          } catch (error) {
            console.error("Error fetching recommendation:", error);
          }
        });
      }

      setCurrentTitle(titles[currentQuestion._id] || '');
      if (!titles[currentQuestion._id]) {
        fetchTitle(currentQuestion._id); // Fetch the title for the current question
      }
    }
  }, [currentQuestionIndex, answers, questions, titles]);

  const handleAnswerChange = async (event, optionType) => {
    let updatedOptions = selectedOptions;
    let updatedAnswer = currentAnswer;
    const currentQuestion = questions[currentQuestionIndex];
  
    if (!currentQuestion) return;
  
    // Handle different option types
    if (optionType === 'checkbox') {
      updatedOptions = event.target.checked
        ? [...selectedOptions, event.target.value]
        : selectedOptions.filter(option => option !== event.target.value);
      setSelectedOptions(updatedOptions);
      setCanProceed(updatedOptions.length > 0);
      updateAnswers(updatedOptions, currentQuestion._id);
    } else if (optionType === 'openEnded') {
      const newText = event.target.value;
      setOpenEndedText(newText);
      const wordCount = getWordCount(newText);
      setIsWordCountExceeded(wordCount > openEndedWordLimit);
      setCanProceed(wordCount <= openEndedWordLimit && newText.trim().length > 0);
      updateAnswers(newText, currentQuestion._id);
    } else {
      updatedAnswer = event.target.value;
      setCurrentAnswer(updatedAnswer);
      setCanProceed(updatedAnswer.trim() !== '');
      updateAnswers(updatedAnswer, currentQuestion._id);
    }
  
    if (optionType === 'multipleChoice' || optionType === 'dropdown') {
      const selectedOption = currentQuestion.options.find(option => option.text === event.target.value);
      if (selectedOption && selectedOption.optionsNextQuestion) {
        setQuestionStack([...questionStack, { questionId: currentQuestion._id, nextQuestion: currentQuestion.nextQuestion }]);
        await handleOptionsNextQuestion(selectedOption.optionsNextQuestion);
      }
    }
  
    if (optionType === 'checkbox') {
      const nextQuestionIds = updatedOptions.map(optionText => {
        const selectedOption = currentQuestion.options.find(option => option.text === optionText);
        return selectedOption?.optionsNextQuestion;
      }).filter(Boolean);
  
      if (nextQuestionIds.length > 0) {
        setQuestionStack([...questionStack, { questionId: currentQuestion._id, nextQuestion: currentQuestion.nextQuestion }]);
        for (const nextQuestionId of nextQuestionIds) {
          await handleOptionsNextQuestion(nextQuestionId);
        }
      }
    }
  };


  const handleGridAnswerChange = (rowIndex, colIndex, optionType) => {
    const currentQuestion = questions[currentQuestionIndex];
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

      updateAnswers(newGridAnswers, currentQuestion._id);
      const isValid = validateGridAnswersWithTempAnswers(newGridAnswers, currentQuestion);
      setCanProceed(isValid);

      return newGridAnswers;
    });
  };

  const validateGridAnswersWithTempAnswers = (tempAnswers, question) => {
    if (question.optionType === 'multipleChoiceGrid' || question.optionType === 'checkboxGrid') {
      if (question.requireResponse) {
        return question.grid.rows.every((_, rowIndex) => {
          const rowAnswers = tempAnswers[rowIndex] || [];
          return rowAnswers.length > 0;
        });
      }
    }
    return true;
  };

  const updateAnswers = (newAnswer, questionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: newAnswer
    }));
    localStorage.setItem('surveyResponses', JSON.stringify({ ...answers, [questionId]: newAnswer }));
    localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
  };
  

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const fetchQuestionById = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/fetchQuestionById/${questionId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const question = await response.json();
      console.log("Fetched Question by ID:", question); // Logging for debugging
      return question;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      return null;
    }
  };
  const findPreviousQuestion = (currentQuestionId, questionFlow) => {
    let previousQuestion = null;

    // Find the current question in the question flow
    if (Array.isArray(questionFlow)) {
        const currentQuestionIndex = questionFlow.findIndex(q => q._id === currentQuestionId);
        
        if (currentQuestionIndex > 0) {
            // Check if the previous question is directly before the current question
            previousQuestion = questionFlow[currentQuestionIndex - 1];
        } else {
            // Find the question whose nextQuestion is the currentQuestionId
            previousQuestion = questionFlow.find(q => q.nextQuestion === currentQuestionId);
        }
    }

    if (previousQuestion) {
        console.log('Previous Question:', previousQuestion);
        return previousQuestion;
    }

    console.log('Previous Question not found');
    return null;
};


const findNextQuestion = (currentQuestionId, answer, questionFlow, questionStack) => {
  // Initialize currentQuestion to null
  let currentQuestion = null;

  // Find the current question in the question flow
  if (Array.isArray(questionFlow)) {
      currentQuestion = questionFlow.find(q => q._id === currentQuestionId);
  }

  if (!currentQuestion) {
      console.error("Current question not found in the question flow");
      return null;
  }

  // Handle different question types
  if (currentQuestion.optionType === 'multipleChoice' || currentQuestion.optionType === 'dropdown') {
      const selectedOption = currentQuestion.options.find(option => option.text === answer);
      if (selectedOption && selectedOption.optionsNextQuestion) {
          return selectedOption.optionsNextQuestion;
      }
  } else if (currentQuestion.optionType === 'checkbox') {
      const nextQuestionIds = currentQuestion.options
          .filter(option => answer.includes(option.text))
          .map(option => option.optionsNextQuestion)
          .filter(Boolean);
      if (nextQuestionIds.length > 0) {
          return nextQuestionIds[0]; // Returning the first next question for simplicity
      }
  } else if (currentQuestion.optionType === 'openEnded') {
      if (currentQuestion.nextQuestion) {
          return currentQuestion.nextQuestion;
      } else if (currentQuestion.options?.[0]?.optionsNextQuestion) {
          return currentQuestion.options[0].optionsNextQuestion;
      }
  }

  // If the question has a direct nextQuestion reference
  if (currentQuestion.nextQuestion) {
      return currentQuestion.nextQuestion;
  }

  // If no specific next question is found, look for the next question in the series
  const currentQuestionIndex = questionFlow.findIndex(q => q._id === currentQuestionId);
  if (currentQuestionIndex !== -1 && currentQuestionIndex < questionFlow.length - 1) {
      return questionFlow[currentQuestionIndex + 1]._id;
  }

  // Stack-based search if no next question is found
  if (questionStack && questionStack.length > 0) {
    while (questionStack.length > 0) {
      const stackItem = questionStack.pop(); // Remove the last item from the stack
      const topQuestion = questionFlow.find(q => q._id === stackItem.questionId);
      if (topQuestion && topQuestion.nextQuestion) {
        // Return the next question ID found
        return topQuestion.nextQuestion;
      }
    }
  }
  console.log('Next Question not found');
  return null;
};

const handleNextQuestion = async () => {
  const currentQuestion = questions[currentQuestionIndex];
  setcurrentquestion(currentQuestion);

  // If it's the last question in 'general' stage, show final modal
  if (currentQuestion?.islastQuestion === true && currentStage === 'general') {
    setshowFinalModal(true);
    return null;
  }

  let newAnswer;
  if (currentQuestion?.optionType === 'checkbox') {
      newAnswer = selectedOptions;
  } else if (currentQuestion?.optionType.includes('Grid')) {
      newAnswer = gridAnswers;
  } else if (currentQuestion?.optionType === 'openEnded') {
      newAnswer = openEndedText;
  } else {
      newAnswer = currentAnswer;
  }

  updateAnswers(newAnswer, currentQuestion?._id);
  setNavigationHistory(prevHistory => [...prevHistory, currentQuestionIndex]);
  
  setQuestionStack(prevStack => {
      // Check if the current question is already in the stack
      if (prevStack.length === 0 || prevStack[prevStack.length - 1].questionId !== currentQuestion?._id) {
          return [...prevStack, { questionId: currentQuestion?._id, answer: newAnswer }];
      }
      return prevStack;
  });

  setVisitedQuestions(prevSet => {
    const newSet = new Set(prevSet);
    newSet.add(currentQuestion?._id); // Add current question as visited
    return newSet;
  });

  const nextQuestionId = findNextQuestion(currentQuestion?._id, newAnswer, questionFlow, questionStack);

  if (nextQuestionId == null && currentStage === 'country') {
    setcountryFinal(true);
    return null; 
  }

  // Handle when next question is already visited
  if (nextQuestionId && !visitedQuestions.has(nextQuestionId)) {
    await handleDirectNextQuestion(nextQuestionId);
  } else if (questionStack.length > 0) {
    // Pop the last item in stack to get the next context
    const nextContext = questionStack.pop();
    setQuestionStack([...questionStack]); // Update state with the new stack
    await handleDirectNextQuestion(nextContext.questionId);
  } else {
    console.log("No more questions to display.");
    // Prevent repeated questions after the last one
    if (currentStage === 'country') {
      setcountryFinal(true);
    } else if (currentStage === 'general') {
      setshowFinalModal(true);
    }
  }

  setLoading(false);
};


const handlePreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      
      setCurrentQuestionIndex(prevIndex);
      setRecommendations({});

      // Save to local storage
      localStorage.setItem('currentQuestionIndex', prevIndex);
      localStorage.setItem('answers', JSON.stringify(answers));
      localStorage.setItem('questionOrder', JSON.stringify(questions));

      const prevQuestion = questions[prevIndex];
      if (prevQuestion && prevQuestion._id) {
          restorePreviousQuestionState(prevQuestion);
      } else {
          console.error('Previous question does not have a valid ID.');
      }
      
      // Update navigation history
      const updatedNavigationHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(updatedNavigationHistory);
      localStorage.setItem('navigationHistory', JSON.stringify(updatedNavigationHistory));
  } else {
      console.warn('Cannot go back, currentQuestionIndex is 0.');
  }
};

const restorePreviousQuestionState = (question) => {
  const prevAnswer = answers[question._id];

  if (Array.isArray(prevAnswer)) {
      setSelectedOptions(prevAnswer);
      setCanProceed(prevAnswer.length > 0);
  } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
      setGridAnswers(prevAnswer);
      const isValid = validateGridAnswersWithTempAnswers(prevAnswer, question);
      setCanProceed(isValid);
  } else {
      setCurrentAnswer(prevAnswer || '');
      setOpenEndedText(prevAnswer || '');
      setCanProceed(prevAnswer?.trim() !== '');
  }

  setQuestionFlow(questionFlow.map((q, index) => ({
      ...q,
      isVisible: index <= currentQuestionIndex
  })));
};


const handleSkipQuestion = async () => {
  // Check if current question is marked as the last question
  const currentQuestion = questions[currentQuestionIndex];
  setcurrentquestion(currentQuestion);
  
  if (currentQuestion?.islastQuestion === true && currentStage === 'general') {
    // Disable skip functionality if it's the last question
    console.log("This is the last question. Skipping is disabled.");
    return null;
  }

  // If current question is not the last question, proceed with skipping
  const nextQuestionId = findNextQuestion(currentQuestion?._id, currentAnswer, questionFlow, questionStack);

  if (nextQuestionId) {
    await handleDirectNextQuestion(nextQuestionId);
  } else if (questionStack.length > 0) {
    // Pop the last item in the stack to get the next context if no nextQuestionId is found
    const nextContext = questionStack.pop();
    setQuestionStack([...questionStack]); // Update state with the new stack
    await handleDirectNextQuestion(nextContext.questionId);
  } else {
    console.log("No next question to skip to.");
  }
};
const handleSaveProgress = () => {
  localStorage.setItem('surveyResponses', JSON.stringify(answers));
  localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
  alert("Progress saved successfully!");
};



const handleOptionsNextQuestion = async (optionsNextQuestionId) => {
  let nextQuestionId = optionsNextQuestionId;

  while (nextQuestionId) {
    const nextQuestion = await fetchQuestionById(nextQuestionId);
    if (!nextQuestion) break;

    addQuestionToFlow(nextQuestion);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setRecommendations({});

    if (!nextQuestion.optionsNextQuestion) {
      // If there's no further optionsNextQuestion, break the loop
      break;
    }

    nextQuestionId = nextQuestion.optionsNextQuestion;
  }

  // After the optionsNextQuestion chain is complete, check if we need to return to the original context
  if (questionStack.length > 0) {
    const originalContext = questionStack[questionStack.length - 1];
    await handleDirectNextQuestion(originalContext.nextQuestion);
  }
};

  const handleDirectNextQuestion = async (nextQuestionId) => {
    if (!nextQuestionId) return;
  
    const nextQuestion = await fetchQuestionById(nextQuestionId);
    if (nextQuestion) {
      addQuestionToFlow(nextQuestion);
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      
      setRecommendations({});
    } else {
      console.error("Error: Next question not found for ID", nextQuestionId);
    }
  };

  
  const addQuestionToFlow = (question) => {
    setDynamicQuestions(prevDynamicQuestions => ({
      ...prevDynamicQuestions,
      [question._id]: question,
    }));
  
    setAddedQuestions(prevAddedQuestions => {
      const newAddedQuestions = { ...prevAddedQuestions, [question._id]: question };
      setQuestionFlow(prevFlow => [
        ...prevFlow.slice(0, currentQuestionIndex + 1),
        ...Object.values(newAddedQuestions).map(q => ({ ...q, isVisible: true })),
      ]);
      return newAddedQuestions;
    });
  
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(currentQuestionIndex + 1, 0, question);
      return updatedQuestions;
    });
  };

  // const handlePreviousQuestion = () => {
  //   if (currentQuestionIndex > 0) {
  //     // Move to the previous question in one step
  //     const lastVisitedIndex = navigationHistory.length > 1 ? navigationHistory[navigationHistory.length - 2] : 0;
  //     const updatedHistory = navigationHistory.slice(0, -1); // Remove the last entry from history
  
  //     setCurrentQuestionIndex(lastVisitedIndex); // Set to the last visited index
  //     setNavigationHistory(updatedHistory); // Update history
  
  //     const prevQuestion = questions[lastVisitedIndex]; // Get the previous question
  //     const prevAnswer = answers[prevQuestion._id]; // Retrieve the previous answer
  
  //     // Restore the previous state
  //     if (Array.isArray(prevAnswer)) {
  //       setSelectedOptions(prevAnswer);
  //       setCanProceed(prevAnswer.length > 0);
  //     } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
  //       setGridAnswers(prevAnswer);
  //       const isValid = validateGridAnswersWithTempAnswers(prevAnswer, prevQuestion);
  //       setCanProceed(isValid);
  //     } else {
  //       setCurrentAnswer(prevAnswer || '');
  //       setOpenEndedText(prevAnswer || '');
  //       setCanProceed(prevAnswer?.trim() !== '');
  //     }
  
  //     // Ensure only the correct questions are visible
  //     setQuestionFlow(questionFlow.map((question, index) => ({
  //       ...question,
  //       isVisible: index <= lastVisitedIndex
  //     })));
  //   }
  // };

//   const handlePreviousQuestion = () => {
//     // setLoading(true)
//     if (currentQuestionIndex > 0) {
//         // Retrieve the previous index from the navigation history
//         const lastVisitedIndex = navigationHistory.length > 1 ? navigationHistory[navigationHistory.length - 2] : 0;
//         const updatedHistory = navigationHistory.slice(0, -1); // Remove the last entry from history

//         setCurrentQuestionIndex(lastVisitedIndex);
//         setNavigationHistory(updatedHistory);

//         const prevQuestion = questions[lastVisitedIndex];
//         const prevAnswer = answers[prevQuestion._id];

//         // Restore the previous state based on the type of question
   
//         if (Array.isArray(prevAnswer)) {
//             setSelectedOptions(prevAnswer);
//             setCanProceed(prevAnswer.length > 0);
//         } else if (typeof prevAnswer === 'object' && prevAnswer !== null) {
//             setGridAnswers(prevAnswer);
//             const isValid = validateGridAnswersWithTempAnswers(prevAnswer, prevQuestion);
//             setCanProceed(isValid);
//         } else {
//             setCurrentAnswer(prevAnswer || '');
//             setOpenEndedText(prevAnswer || '');
//             setCanProceed(prevAnswer?.trim() !== '');
//         }

//         // Ensure only the correct questions are visible
//         setQuestionFlow(questionFlow.map((question, index) => ({
//             ...question,
//             isVisible: index <= lastVisitedIndex
//         })));
//     }
//     setLoading(false);
// };


  const handleClearSelection = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion?.optionType === 'checkboxGrid' || currentQuestion?.optionType === 'multipleChoiceGrid') {
      const resetGridAnswers = {};
      currentQuestion.grid.rows.forEach((_, rowIndex) => {
        resetGridAnswers[rowIndex] = [];
      });
      setGridAnswers(resetGridAnswers);
      updateAnswers(resetGridAnswers, currentQuestion?._id);
    } else if (currentQuestion?.optionType === 'checkbox') {
      setSelectedOptions([]);
      updateAnswers([], currentQuestion?._id);
    } else if (currentQuestion?.optionType === 'openEnded') {
      setOpenEndedText('');
      updateAnswers('', currentQuestion?._id);
    } else {
      setCurrentAnswer('');
      updateAnswers('', currentQuestion?._id);
    }

    setCanProceed(false);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountries((prevSelectedCountries) =>
      prevSelectedCountries.includes(country)
        ? prevSelectedCountries.filter((c) => c !== country)
        : [...prevSelectedCountries, country]
    );
  };

  const handleCountrySelectionConfirm = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let newAnswer;

    if (currentQuestion?.optionType === 'checkbox') {
      newAnswer = selectedOptions;
    } else if (currentQuestion?.optionType.includes('Grid')) {
      newAnswer = gridAnswers;
    } else if (currentQuestion?.optionType === 'openEnded') {
      newAnswer = openEndedText;
    } else {
      newAnswer = currentAnswer;
    }

    updateAnswers(newAnswer, currentQuestion?._id);
    setShowCountrySelectionModal(true);
  };

  const handleCountrySelectionModalConfirm = async () => {
    if (selectedCountries.length > 0) {
      setShowCountrySelection(false);
      setShowCountrySelectionModal(false);

      try {
        const response = await fetch(`http://${destination}/api/fetchQuestionsByCountries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ countries: selectedCountries }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error on fetchQuestionsByCountries endpoint! status: ${response.status}`);
        }

        const countrySpecificQuestions = await response.json();
        console.log("Specific country questions:", countrySpecificQuestions);
        
        if (countrySpecificQuestions.length === 0) {
          alert("No questions available for the selected countries.");
          setShowCountrySelection(true);
          setCurrentStage('general');
          return;
        }

        setCountryQuestions(countrySpecificQuestions);
        setQuestions(countrySpecificQuestions);
        setQuestionStack([]);
        setVisitedQuestions(new Set());
        setQuestionFlow(countrySpecificQuestions.map(question => ({ ...question, isVisible: true })));
        setCurrentQuestionIndex(0);
        setCurrentStage('country');
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing countries or fetching related questions:", error);
      }
    } else {
      alert("Please select at least one country.");
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = countries.filter(country =>
      country.toLowerCase().includes(query)
    );

    setFilteredCountries(filtered);
  };

  const scrollToCountry = (countryName) => {
    const countryRef = countryRefs.current[countryName];

    if (countryRef && countryRef.current) {
      countryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let newAnswer;

    if (currentQuestion?.optionType === 'checkbox') {
      newAnswer = selectedOptions;
    } else if (currentQuestion?.optionType.includes('Grid')) {
      newAnswer = gridAnswers;
    } else if (currentQuestion?.optionType === 'openEnded') {
      newAnswer = openEndedText;
    } else {
      newAnswer = currentAnswer;
    }

    updateAnswers(newAnswer, currentQuestion?._id);
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const lastAnswer = currentQuestion?.optionType.includes('Grid') ? gridAnswers : currentQuestion?.optionType === 'checkbox' ? selectedOptions : currentAnswer;
    updateAnswers(lastAnswer, currentQuestion?._id);

    const allAnswers = JSON.parse(localStorage.getItem('surveyResponses')) || {};
    const answeredQuestions = Object.keys(allAnswers).map((questionId) => {
      const question = questions.find(q => q._id === questionId);
      const answer = allAnswers[questionId];
      return {
        questionId,
        question: question ? question.question : 'Unknown Question',
        answer: answer,
      };
    });

    console.log("Submitted Answers:", answeredQuestions);

    localStorage.setItem('submittedResponses', JSON.stringify(answeredQuestions));

    // Get userId (assume you have a way to get the logged-in user's ID)
    const userId = "exampleUserId"; // Replace with actual user ID retrieval logic

    // Collect data for submission
    const dataToSubmit = {
      userId,
      responses: answeredQuestions,
      selectedCountries,
    };

    try {
      const response = await fetch(`http://${destination}/api/submitResponse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        console.log("Response submitted successfully.");
        navigate('/responses');
      } else {
        console.error("Error submitting response.");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleGoToCountrySelection = () => {
    handleCountrySelectionConfirm();
    setShowCountrySelection(true);
  };
  const dehandleGotoCountrySelection = ()=>{
    setShowCountrySelection(false);
    setShowCountrySelectionModal(false);
  }

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  const showCountrySelectionButton = currentStage === 'general' && isFinal;

  const renderOptions = (question) => {
    if (!question) return null;
    switch (question.optionType) {
      case 'multipleChoice':
        return question.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`option_${index}`}
              value={option.text}
              onChange={(e) => handleAnswerChange(e, 'multipleChoice')}
              checked={currentAnswer === option.text}
              className="form-check-input"
            />
            <label htmlFor={`option_${index}`}>{option.text}</label>
            {recommendations[option._id] && (
              <div className="recommendation-text">
                <strong>Recommendation:</strong> {recommendations[option._id]}
              </div>
            )}
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
            {recommendations[option._id] && (
              <div className="recommendation-text">
                <strong>Recommendation:</strong> {recommendations[option._id]}
              </div>
            )}
          </div>
        ));
      case 'dropdown':
        return (
          <select
            className="form-select"
            aria-label="Dropdown select example"
            onChange={(e) => handleAnswerChange(e, 'dropdown')}
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
      case 'openEnded':
        return (
          <>
            <textarea
              className="form-control"
              value={openEndedText}
              onChange={(e) => handleAnswerChange(e, 'openEnded')}
              placeholder="Your answer..."
            />
            <div>
              Words:{" "}
              <span className={isWordCountExceeded ? "word-count-exceeded" : ""}>
                {getWordCount(openEndedText)}/{openEndedWordLimit}
              </span>
            </div>
          </>
        );
      case 'debug':
        return (
          <pre>{JSON.stringify(question.options, null, 2)}</pre>
        );
      default:
        return null;
    }
  };

  const renderCountrySelection = () => {
    return (
      <div className="survey-questions-container">
        <div className="survey-questions-card">
          <h5>Select countries to export</h5>
          <div className="input-group mb-3 search-input-group">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Type to search..."
              aria-label="Search"
              aria-describedby="basic-addon1"
              onChange={handleSearchChange}
              value={searchQuery}
            />
            {searchQuery && (
              <button className="btn btn-outline-secondary" type="button" id="button-clear" onClick={() => setSearchQuery('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <div className="options-container options-container-fixed-height">
            {filteredCountries.map((country, index) => (
              <div key={index} ref={countryRefs.current[country]}>
                <input
                  type="checkbox"
                  id={`country_${country}`}
                  value={country}
                  onChange={() => handleCountrySelect(country)}
                  checked={selectedCountries.includes(country)}
                  className="form-check-input"
                />
                <label htmlFor={`country_${country}`}>{country}</label>
              </div>
            ))}
          </div>
        </div>
        <footer className="survey-questions-footer">
          <button
            className="survey-questions-button"
            onClick={handleCountrySelectionConfirm}
            disabled={selectedCountries.length === 0}
          >
            Confirm
          </button>
        </footer>
      </div>
    );
  };

  const renderTitle = (questionId) => {
    const titleData = titles[questionId];
    if (!titleData) return isTitleLoading ? <div>Loading title...</div> : null;

    return (
      <div className="question-title">
        {titleData.title && <h4>{titleData.title}</h4>}
      </div>
    );
  };

  // if (loading) {
  //   return (
  //     <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
  //       <span className="sr-only">Loading...</span>
  //       <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
  //       <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
  //       <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
  //     </div>
  //   );
  // }
  const handleSurveyConfirmSubmit=()=>{
    setFinal(true);
    setShowCountrySelection(true);
    setshowFinalModal(false);
  }

  return (
    <div className="survey-questions-container">
      {isLoading && <div>Loading questions...</div>}
      {!isLoading && !questions.length && <div>No questions available</div>}
      {!isLoading && questions.length > 0 && (
        <div className="survey-questions-card">
          {renderTitle(questions[currentQuestionIndex]?._id)}
          <h4>{currentStage === 'general' ? currentQuestionIndex + 1 : currentQuestionIndex + 1}. {questions[currentQuestionIndex]?.question || 'Select Country'}</h4>

          <div className="options-container">
            {renderOptions(questions[currentQuestionIndex])}
          </div>
          <footer className="survey-questions-footer">
            <div className="survey-questions-navigation-buttons">
              {(currentStage === 'general' && currentQuestionIndex > 0 && !isFinal) ||
              (currentStage === 'country' && currentQuestionIndex > 0 && (!isFinal || !countryFinal)) ? (
                <button className="survey-questions-button" onClick={handlePreviousQuestion}>Back</button>
              ) : null}

              {showCountrySelectionButton ? (
                <button className="survey-questions-button" onClick={handleGoToCountrySelection}>Go to Country Selection</button>
              ) : !isFinal || !countryFinal ? (
                <button className="survey-questions-button" onClick={handleNextQuestion} disabled={!canProceed || isWordCountExceeded}>Next</button>
              ) : countryFinal ? (
                <button className="survey-questions-button" onClick={handleSubmit} disabled={!canProceed || isWordCountExceeded}>Submit</button>
              ) : (<></>)}
              {(!currentquestion?.islastQuestion || currentStage !== 'general') && (
                <button className="survey-questions-button" onClick={handleSkipQuestion}>
                  Skip
                </button>
              )}
              <button className="survey-questions-button" onClick={handleSaveProgress}>Save</button> 
            </div>
            <button className="survey-questions-button text-button" onClick={handleClearSelection}>Clear</button>
          </footer>
        </div>
      )}
      {showCountrySelection && renderCountrySelection()}
      {showModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Submission</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to submit your answers?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmSubmit}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

{showFinalModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Submission</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setshowFinalModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to submit your answers?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setshowFinalModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSurveyConfirmSubmit}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCountrySelectionModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Navigation</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowCountrySelectionModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to navigate? You can't go back once you confirm.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowCountrySelectionModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleCountrySelectionModalConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
