import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FirstQuestionModal from './firstQuestionModal';
// import RecommendationComponent from './recommendationComponent';

// import Questions from './questions';
// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class EditQuestion extends Component {
  constructor(props) {
    super(props);

    // Declare all state variables to observe below
    this.state = {
      initialData: '',
      question: '',
      marks: '',
      explanation: '',
      recommendation: '',
      // recommendationValue: "",
     // previousQuestion: '',
      nextQuestion: '',

      selectedOption: 'multipleChoice',
      options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false ,recommendation: 'Recommendation 1'}],
      defaultLinearArray: [ { scale: 1, label: 'Strongly Disagree' }, { scale: 5, label: 'Strongly Agree' },  ],
      gridOptions: { row: [{ label: 'Row 1', value: 'Row 1' }], column: [{ label: 'Column 1', value: 'Column 1' }], answers: [] },
      showCountry: false,
      countries: [
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
      ],
      selectedCountry: [], // omit this line when `selectedCountry` is redundant
      country: {
        selectedCountry: '',
        countryFirstQuestion: false
      },
      isLeadingQuestion: false,
      showExplanation: false,
      showToast: false,
      validationErrors: {
        title: '',
        question: '',
        optionType: '',
        grid: '',
        options: '',
        openEnded: '',
        marks: '',
        country: '',
        explanation: '',
      },
      requireResponse: false,
      // Additional variables
      questionIndex: props.index,
      questionId: props.questionId,
      //1
      // details: {recommendation: ''},
      allQuestions: [],
      allTitles:[],
      selectedTitle: '',
      selectedTitleQuestions: [],
      questionList: {
        question: null, 
        optionType: 'multipleChoice',
        options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false, optionsNextQuestion: null ,recommendation: 'Recommendation 1'}],
        linearScale: [],
        openEndedText: '',
        marks: '',
        nextQuestion: null
      },
      subTitle: {
        id: '',
        firstQuestion: false
      },
      nestedTitle: {
        id: '',
        firstQuestion: false
      },
      subTitleLabel: '',
      nestedTitleLabel: '',
      showFirstQuestionNestedTitleOption: false,
      showFirstQuestionSubTitleOption: false,
      nestedTitleFirstQuestionRender: false,
      nestedTitleFirstQuestionId: '',
      nestedTitleFirstQuestionValue: '',
      subTitleFirstQuestionRender: false,
      subTitleFirstQuestionId: '',
      subTitleFirstQuestionValue: '',
      openEndedWordLimit: 500,
      openEndedWordCount: 0,
      stateQuestionId: '',
      showModal: false,
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    // Modal ref
    this.editQuestionModalRef = React.createRef();
    // bind API
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.onEditClickHandler = this.onEditClickHandler.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    // const [recom,setRecom] = useState({recommendation: ""});

  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast 
    });
  }

  firstQuestionModalOnHide = () => {
    this.setState( {
      // countryFirstQuestionRender: false,
      nestedTitleFirstQuestionRender: false,
      subTitleFirstQuestionRender: false
    })
  };
  updateSubTitleFirstQuestion = () => {
    // console.log(`prop updateSubTitleFirstQuestion executed.`)
    
    const { allQuestions, subTitleFirstQuestionId } = this.state;
    const updatedQuestions = allQuestions.map(question => {
      if (question._id === subTitleFirstQuestionId) {
        // console.log(`question._id === subTitleFirstQuestionId`)
        return { 
          ...question,
          subTitle: {
            ...question.subTitle,
            id: subTitleFirstQuestionId,
            firstQuestion: false,
          },
        };
      } else {
        return question;
      }
    });
    this.setState({ allQuestions: updatedQuestions });

    // Reset state value to false and update toggle to TRUE
    this.setState(prevState => ({ 
      subTitleFirstQuestionRender: false,
      subTitle: {
        ...prevState.subTitle,
        firstQuestion: true
      },
     }));

    this.fetchQuestions();
  };

  updateNestedTitleFirstQuestion = () => {
    // console.log(`prop updateNestedTitleFirstQuestion executed.`)
    
    const { allQuestions, nestedTitleFirstQuestionId } = this.state;
    const updatedQuestions = allQuestions.map(question => {
      if (question._id === nestedTitleFirstQuestionId) {
        // console.log(`question._id === nestedTitleFirstQuestionId`)
        return { 
          ...question,
          nestedTitle: {
            ...question.nestedTitle,
            id: nestedTitleFirstQuestionId,
            firstQuestion: false,
          },
        };
      } else {
        return question;
      }
    });
    this.setState({ allQuestions: updatedQuestions });

    // Reset state value to false and update toggle to TRUE
    this.setState(prevState => ({ 
      nestedTitleFirstQuestionRender: false,
      nestedTitle: {
        ...prevState.nestedTitle,
        firstQuestion: true
      },
     }));

    this.fetchQuestions();
  };

/*--------------onClick-----------------*/

  onEditClickHandler = (id) => {
    // Load all questions
    this.fetchQuestions().then(
      // Load specific question
      this.fetchQuestion(id)
    );
  };

/*--------------API-----------------*/
  
  fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/read/${questionId}`);
      const data = await response.json();
      if (data) {
        // Check if selectedCountry field is present and has a value
        const showCountry = data.country && data.country.selectedCountry;

        // If nested title, show the first question option
        this.handleFirstQuestionNestedTitleOption(data.titleId);
        //If subtitle,show
        this.handleFirstQuestionSubTitleOption(data.titleId);
        this.setState({
          initialData: data,
          showModal: true, 
          nestedTitle: data.nestedTitle,
          subTitle: data.subTitle,
          questionList: data,
          selectedTitle: data.titleId,
          selectedOption: data.optionType,
          gridOptions: data.grid,
          isLeadingQuestion: (data.marks) ? false : true,
          showCountry: showCountry // Set showCountry based on selectedCountry field
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  fetchQuestions = async () => {
    try {
      const response = await fetch(`http://${destination}/api/displayAllQuestions`);
      const questions = await response.json();
      this.setState({ allQuestions: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  updateQuestion = async(questionId, dataToUpdate) => {
    try {
      const response = await fetch(`http://${destination}/api/update/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      })
      if (response.ok) {
        console.log('Data submitted successfully');
        this.setState({ 
          showModal: false,
          showToast: true 
        });
        setTimeout(() => this.setState({ showToast: false }), 10000);

        // Trigger re-fetch in parent component questions.js
        this.props.refreshQuestions();
 
      } else {
        console.error('Server responded with an error:', response.status, response.statusText);
        const responseData = await response.json();
        console.error('Server error data:', responseData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    // debug
    // console.log(`questionList: ${JSON.stringify(this.state.questionList)}`)
  };

  // Add this method to fetch filtered questions
  async fetchFilteredQuestions() {
    try {
      const response = await fetch(`http://${destination}/api/filtered-questions`);
      const filteredQuestions = await response.json();
  
      this.setState({ filteredQuestions }); // Update state with fetched questions
    } catch (error) {
      console.error('Error fetching filtered questions:', error);
    }
  };

  fetchTitles = async () => {
    try {
      const response = await fetch(`http://${destination}/api/displayTitles`);
      const titles = await response.json();
      this.setState({ allTitles: titles });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
// Function to fetch recommendation by Option ID
//  fetchOptionRecommendation = async (optionId) => {
//   try {
//       const response = await fetch(`http://${destination}/api/recommendation/option/${optionId}`);
//       if (!response.ok) {
//           throw new Error('Failed to fetch recommendation');
//       }
//       const { recommendation } = await response.json();
//       return recommendation;
//   } catch (error) {
//       console.error('Error fetching recommendation:', error);
//       throw error;
//   }
// };

fetchRecommendationText = async (optionId) => {
  try {
    const response = await fetch(`http://${destination}/api/recommendationText/${optionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const recommendationTextData = await response.json();
    return recommendationTextData.recommendations;
  } catch (error) {
    console.error("Error fetching option text:", error);
  }
};

/*-------------MODAL-----------------*/

  componentDidMount() {
    // reset
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.addEventListener('hidden.bs.modal', this.resetState);
    this.fetchFilteredQuestions();
    this.fetchTitles();
  }

  componentDidUpdate(prevProps) {
    if (this.props.questionsChanged !== prevProps.questionsChanged) {
      this.fetchQuestions();
      this.fetchTitles();
    }
  };

  componentWillUnmount() {
    const editQuestionModal = document.getElementById("editQuestion");
    editQuestionModal.removeEventListener('hidden.bs.modal', this.resetState);
  }

/*----------- function helpers ----------------------*/

  handleTitleSelect = (e) => {
    const { allQuestions } = this.state;

    let titleQuestionsArray = [];
    for (let i=0; i<allQuestions.length; i++) {
      if (e === allQuestions[i].titleId) {
        titleQuestionsArray.push(allQuestions[i])
        // console.log(`matching Qs: ${allQuestions[i].question}`)
      };
    };
    // console.log(`matching Qs Id: ${JSON.stringify(titleQuestionsArray)}`)

    this.handleFirstQuestionNestedTitleOption(e);

    this.setState({ 
      selectedTitle: e,
      selectedTitleQuestions: titleQuestionsArray,
    });
  };

  fetchNestedTitles = () => {
    const { allTitles } = this.state;

    // Determine nested titles
    let nestedTitlesArray = [];
    // loops through main titles
    for (let i=0; i<allTitles.length; i++) {      
      // loops through subtitles
      for (let j=0; j<allTitles[i].title.subTitle.length; j++) {
        // loops through nested titles
        for (let k=0; k<allTitles[i].title.subTitle[j].nestedTitle.length; k++) {
          // console.log(`nestedTitles label: ${allTitles[i].title.subTitle[j].nestedTitle[k].nestedTitleLabel}`)
          nestedTitlesArray.push({nestedTitleLabel: allTitles[i].title.subTitle[j].nestedTitle[k].nestedTitleLabel, id: allTitles[i].title.subTitle[j].nestedTitle[k]._id});
        };
      };
    };
    return nestedTitlesArray;
  };

  fetchSubTitles = () => {
    const { allTitles } = this.state;

    // Determine sub titles
    let subTitlesArray = [];
    // loops through main titles
    for (let i=0; i<allTitles.length; i++) {      
      // loops through subtitles
      for (let j=0; j<allTitles[i].title.subTitle.length; j++) {
        // loops through nested titles
        // for (let k=0; k<allTitles[i].title.subTitle[j].nestedTitle.length; k++) 
          // console.log(`nestedTitles label: ${allTitles[i].title.subTitle[j].nestedTitle[k].nestedTitleLabel}`)
          subTitlesArray.push({subTitleLabel: allTitles[i].title.subTitle[j].subTitleLabel, id: allTitles[i].title.subTitle[j]._id});
        
      };
    };
    return subTitlesArray;
  };
  handleFirstQuestionSubTitleOption = (e) => {
    
    let subTitlesArray = this.fetchSubTitles();
        console.log("subtitlesArray: ",subTitlesArray);
        // console.log("Selecred title :" this.state.selectedTitle);
    // Determine a match for sub title with the selected title
    for (let i=0; i<subTitlesArray.length; i++) {
      if (e === subTitlesArray[i].id) {
        console.log(`match: ${subTitlesArray[i].subTitleLabel}`)
        this.setState({ 
          showFirstQuestionSubTitleOption: true,
          subTitle: {
            ...this.subTitle,
            id: e,
            firstQuestion: false
          },
          subTitleLabel: subTitlesArray[i].subTitleLabel
         });
        return;
      } 
      // Case: when a title is selected
      else {
        this.setState({
          showFirstQuestionsubTitleOption: false,
          subTitle: {
            ...this.subTitle,
            id: '',
            firstQuestion: false
          }
        });
      }
    };
  };
  handleFirstQuestionNestedTitleOption = (e) => {
    
    let nestedTitlesArray = this.fetchNestedTitles();
    console.log("nestedtitlesArray: ",nestedTitlesArray);

    // Determine a match for nested title with the selected title
    for (let i=0; i<nestedTitlesArray.length; i++) {
      if (e === nestedTitlesArray[i].id) {
        // console.log(`match: ${nestedTitlesArray[i].nestedTitleLabel}`)
        this.setState({ 
          showFirstQuestionNestedTitleOption: true,
          nestedTitle: {
            ...this.nestedTitle,
            id: e,
            firstQuestion: false
          },
          nestedTitleLabel: nestedTitlesArray[i].nestedTitleLabel
         });
        return;
      } 
      // Case: when a subtitle is selected
      else {
        this.setState({
          showFirstQuestionNestedTitleOption: false,
          nestedTitle: {
            ...this.nestedTitle,
            id: '',
            firstQuestion: false
          }
        });
      }
    };
  };
  
  toggleFirstQuestionSubTitle = () => {
    const { initialData, subTitle } = this.state;

    // Case: when changing a sub title to another sub title
    if (initialData.subTitle) {
      // Case: No need to validate if initial subTitle.id already is the existing first question
      // OR Case: when switch is initially ON, no need to validate
      if(
        initialData.subTitle.id !== subTitle.id ||
        initialData.subTitle.firstQuestion === false
      ) {
        // Validate whether sub title first question is vacant or not
        const { 
          issubTitleFirstQuestionVacant,
        } = this.validateFirstQuestionSubTitle();
        
        if (issubTitleFirstQuestionVacant === true) {
          this.setState(prevState => ({
            subTitle: {
              ...prevState.subTitle,
              firstQuestion: !prevState.subTitle.firstQuestion
            }
          }));
        } else {
          // render the firstQuestionModal here
          this.setState({ subTitleFirstQuestionRender: true });
        }
      } else {
        this.setState(prevState => ({
          subTitle: {
            ...prevState.subTitle,
            firstQuestion: !prevState.subTitle.firstQuestion
          }
        }));
      }
    } 
    // Case: when changing a subtitle to a nested title
    else {
      // Validate whether nested title first question is vacant or not
      const { 
        isSubTitleFirstQuestionVacant,
      } = this.validateFirstQuestionSubTitle();
      
      if (isSubTitleFirstQuestionVacant === true) {
        this.setState(prevState => ({
          subTitle: {
            ...prevState.subTitle,
            firstQuestion: !prevState.subTitle.firstQuestion
          }
        }));
      } else {
        // render the firstQuestionModal here
        this.setState({ subTitleFirstQuestionRender: true });
      }
    }
  };
  toggleFirstQuestionNestedTitle = () => {
    const { initialData, nestedTitle } = this.state;

    // Case: when changing a nested title to another nested title
    if (initialData.nestedTitle) {
      // Case: No need to validate if initial nestedTitle.id already is the existing first question
      // OR Case: when switch is initially ON, no need to validate
      if(
        initialData.nestedTitle.id !== nestedTitle.id ||
        initialData.nestedTitle.firstQuestion === false
      ) {
        // Validate whether nested title first question is vacant or not
        const { 
          isNestedTitleFirstQuestionVacant,
        } = this.validateFirstQuestionNestedTitle();
        
        if (isNestedTitleFirstQuestionVacant === true) {
          this.setState(prevState => ({
            nestedTitle: {
              ...prevState.nestedTitle,
              firstQuestion: !prevState.nestedTitle.firstQuestion
            }
          }));
        } else {
          // render the firstQuestionModal here
          this.setState({ nestedTitleFirstQuestionRender: true });
        }
      } else {
        this.setState(prevState => ({
          nestedTitle: {
            ...prevState.nestedTitle,
            firstQuestion: !prevState.nestedTitle.firstQuestion
          }
        }));
      }
    } 
    // Case: when changing a subtitle to a nested title
    else {
      // Validate whether nested title first question is vacant or not
      const { 
        isNestedTitleFirstQuestionVacant,
      } = this.validateFirstQuestionNestedTitle();
      
      if (isNestedTitleFirstQuestionVacant === true) {
        this.setState(prevState => ({
          nestedTitle: {
            ...prevState.nestedTitle,
            firstQuestion: !prevState.nestedTitle.firstQuestion
          }
        }));
      } else {
        // render the firstQuestionModal here
        this.setState({ nestedTitleFirstQuestionRender: true });
      }
    }
  };

  renderNestedTitleFirstQuestionModal = () => {
    const { 
      nestedTitle, 
      nestedTitleLabel, 
      nestedTitleFirstQuestionId, 
      nestedTitleFirstQuestionValue
    } = this.state;
    return (
      <>
        <FirstQuestionModal
          openFirstQuestionModal = {true}
          type = {"nestedTitle"}
          firstQuestionId = {nestedTitleFirstQuestionId}
          firstQuestionValue = {nestedTitleFirstQuestionValue}
          nestedTitleId = {nestedTitle.id}
          nestedTitleLabel = {nestedTitleLabel}
          updateFirstQuestion = {this.updateNestedTitleFirstQuestion}
          firstQuestionModalOnHide = {this.firstQuestionModalOnHide}
        />
      </>
    );
  };
  renderSubTitleFirstQuestionModal = () => {
    const { 
      subTitle, 
      subTitleLabel, 
      subTitleFirstQuestionId, 
      subTitleFirstQuestionValue
    } = this.state;
    return (
      <>
        <FirstQuestionModal
          openFirstQuestionModal = {true}
          type = {"subTitle"}
          firstQuestionId = {subTitleFirstQuestionId}
          firstQuestionValue = {subTitleFirstQuestionValue}
          subTitleId = {subTitle.id}
          subTitleLabel = {subTitleLabel}
          updateFirstQuestion = {this.updateSubTitleFirstQuestion}
          firstQuestionModalOnHide = {this.firstQuestionModalOnHide}
        />
      </>
    );
  };

  handleQuestionText = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, question: e.target.value }
    }))
  }

  handleQuestionOptionType = (e) => {
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        optionType: e.target.value,
        // Condition check for linearScale array
        // If array is empty, set default array
        // If array is not empty, use fetched values
        linearScale:
          prevState.questionList.linearScale.length === 0
            ? this.state.defaultLinearArray
            : prevState.questionList.linearScale,
        // Condition check for openEnded field
        options: prevState.questionList.options.map((option) => ({
          ...option
          // recommendation: '',
        })),
        openEndedText:
          prevState.questionList.openEndedText === undefined
            ? ''
            : prevState.questionList.openEndedText
      }
    }));
  };
 //1
//  handleDetailsChange = (newDetails) => {
//   this.setState({ details: newDetails });
// };

 
  handleQuestionMarks = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, marks: e.target.value }
    }))
  }

  handleQuestionNextQuestion = (e) => {
    this.setState( (prevState) => ({
      questionList: { ...prevState.questionList, nextQuestion: e.target.value }
    }))
  }
  // handleQuestionPreviousQuestion = (e) => {
  //   this.setState( (prevState) => ({
  //     questionList: { ...prevState.questionList, previousQuestion: e.target.value}
  //   }))
  // }

  addOption = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        options: [
          ...prevState.questionList.options,
          { text: "" , isCorrect: false,recommendation: "" }
        ]
      }
    }));
  };

  deleteOption = (index) => {
    this.setState(prevState => ({
      questionList: { ...prevState.questionList, options: prevState.questionList.options.filter((_, i) => i !== index) }
    }));
  };
  
  addGridRow = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        rows: [
          ...prevState.gridOptions.rows,
          { text: ``, value: `Row ${prevState.gridOptions.rows.length + 1}` }
        ]
      }
    }));
  };
  
  addGridColumn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => {
      return {
        gridOptions: {
          ...prevState.gridOptions,
          columns: [
            ...prevState.gridOptions.columns,
            { text: ``, value: `Column ${prevState.gridOptions.columns.length + 1}` }
          ]
        }
      };
    });
  };
  
  deleteGridRow = (index) => {
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        rows: prevState.gridOptions.rows.filter((_, idx) => idx !== index)
      }
    }));
  };
  
  deleteGridColumn = (index) => {
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        columns: prevState.gridOptions.columns.filter((_, idx) => idx !== index)
      }
    }));
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleOptionChangeText = (index, value) => {
    const { questionList } = this.state;
  
   
    this.setState({ questionList: {
      ...questionList,
      options: questionList.options.map((option, i) =>
      i === index ? { ...option, text: value} : option
      ),
    }}) 
  };

  handleOptionRecommendationChange = (index, value) => {
    const { questionList } = this.state;
  
   
    this.setState({ questionList: {
      ...questionList,
      options: questionList.options.map((option, i) =>
      i === index ? { ...option, recommendation: value} : option
      ),
    }}) 
  };

  // 
  // handleOptionRecommendationChange = async (index, recommendation) => {
  //   try {
  //     // Update recommendation in state
  //     const updatedOptions = [...this.state.questionList.options];
  //     updatedOptions[index].recommendation = recommendation;
  //     this.setState({ questionList: { ...this.state.questionList, options: updatedOptions } });
  
  //     // Send recommendation to backend to store in the database
  //     await this.storeRecommendationInDatabase(recommendation, updatedOptions[index].optionId);
  //   } catch (error) {
  //     console.error('Error handling recommendation change:', error);
  //   }
  // };
  // storeRecommendationInDatabase = async (recommendation, optionId) => {
  //   try {
  //     const response = await fetch(`http://${destination}/api/recommendation/option/${optionId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ recommendation }),
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to store recommendation in the database');
  //     }
  //   } catch (error) {
  //     console.error('Error storing recommendation in the database:', error);
  //     throw error;
  //   }
  // };
  
  
  
//   handleOptionRecommendationChange = (index, value) => {
//     const { questionList } = this.state;
//     const updatedOptions = [...questionList.options]; // Create a copy of the options array
//     updatedOptions[index] = { ...updatedOptions[index], recommendation: value }; // Update the recommendation for the specific option
//     this.setState({
//         questionList: {
//             ...questionList,
//             options: updatedOptions, // Update the options array in the state
//         }
//     });
// };

 
    
     
  // handleOptionRecommendationChange = (index, recommendation) => {
  //   const updatedOption = { ...this.state.questionList.options[index], recommendation };
  //   const updatedOptions = this.state.questionList.options.map((option, i) => (i === index ? updatedOption : option));
  //   this.setState({ questionList: { ...this.state.questionList, options: updatedOptions } });
  // };
  
  
  
  
  handleRowChange = (index, e) => {
    const newValue = e.target.value;
    this.setState(prevState => {
      const updatedRow = prevState.gridOptions.rows.map((option, i) => {
        if (i === index) {
          return { ...option, text: newValue, value: newValue };
        }
        return option;
      });
      return {
        gridOptions: {
          ...prevState.gridOptions,
          rows: updatedRow
        }
      };
    });
  };

  handleColumnChange = (index, e) => {
    const newValue = e.target.value;
    this.setState(prevState => {
      const updatedColumn = prevState.gridOptions.columns.map((option, i) => {
        if (i === index) {
          return { ...option, text: newValue, value: newValue };
        }
        return option;
      });
      return {
        gridOptions: {
          ...prevState.gridOptions,
          columns: updatedColumn
        }
      };
    });
  };

  handleOptionsNextQuestionChange = (index, nextQuestionId) => {
    const { questionList } = this.state;
    this.setState({ 
      questionList: {
        ...questionList,
        options: questionList.options.map((option, i) =>
        i === index ? { ...option, optionsNextQuestion: nextQuestionId } : option
        )
    }})
  };
  // handleOptionsPreviousQuestionChange = (index, previousQuestionId) => {
  //   const { questionList } = this.state;
  //   this.setState({ 
  //     questionList: {
  //       ...questionList,
  //       options: questionList.options.map((option, i) =>
  //       i === index ? { ...option, optionsPreviousQuestion: previousQuestionId } : option
  //       )
  //   }})
  // };

  handleLinearScaleLabelChange = (index, value) => {
    const { questionList } = this.state;
    this.setState({ questionList: {
      ...questionList,
      linearScale: questionList.linearScale.map((option, i) =>
      i === index ? { ...option, label: value } : option
      ),
    }}) 
  };

  handleLinearScaleValue = (index, value) => {
    const { questionList } = this.state;
    this.setState({ questionList: {
      ...questionList,
      linearScale: questionList.linearScale.map((option, i) =>
      i === index ? { ...option, scale: value } : option
      ),
    }}) 
  };

  clearGridSelections = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      gridOptions: {
        ...prevState.gridOptions,
        answers: []
      }
    }));
  };

  safeCheckMultipleChoiceGrid() {
    const { gridOptions } = this.state;
    // For radio type, there is only one selection possible for each row
    // hence number of answers cannot be larger than the number of rows
    if (gridOptions.answers.length > gridOptions.rows.length){
      this.setState(prevState => ({
        gridOptions: {
          ...prevState.gridOptions,
          answers: []
        }
      }));
    }
  };

  safeCheckMultipleChoice() {
    const { questionList } = this.state
    
    // check for more than one isCorrect truths, should only have one isCorrect truth for radio buttons
    let countIsCorrect = 0;
        
    for(let i=0; i<questionList.options.length; i++) {    
      if(questionList.options[i].isCorrect === true) {
        countIsCorrect ++
      }
    };

    // clear the selection if more than one answer exists
    if(countIsCorrect>1) {
      this.setState((prevState) => ({
        questionList: {
          ...prevState.questionList,
          options: prevState.questionList.options.map((option) => ({
            ...option,
            isCorrect: false, // Set isCorrect to false for each option
          })),
        },
      }));
    }
  };
 //try 
//  handleOptionRecommendationChange = (index, value) => {
//   const { questionList } = this.state;
//   const updatedOptions = [...questionList.options];
//   updatedOptions[index].recommendation = value; // Update recommendation for the specified option index
//   this.setState({ questionList: { ...questionList, options: updatedOptions } });
// };

  handleOpenEndedText = (e) => {
    this.setState({
      questionList: { ...this.state.questionList, openEndedText: e.target.value },
      openEndedWordCount: this.getWordCount(e.target.value), // Update word count on change
    },
    () => {
      localStorage.setItem("openEndedText", JSON.stringify(this.state.openEndedText))
    });
  };

  getWordCount = (text) => {
    // Split the text by whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
  };

  isOptionNextQuestionUsed = (question) => {
    const { options } = this.state.questionList;
  
    return options.some(option => option.optionsNextQuestion === question._id);
  };
  // isOptionPreviousQuestionUsed = (question) => {
  //   const { options } = this.state.questionList;
  
  //   return options.some(option => option.optionsPreviousQuestion === question._id);
  // };

  // handleCountryChange = (event) => {
  //   const { value } = event.target;
  //   this.setState((prevState) => {
  //     if (prevState.selectedCountries.includes(value)) {
  //       return {
  //         selectedCountries: prevState.selectedCountries.filter(
  //           (country) => country !== value
  //         ),
  //       };
  //     } else {
  //       return {
  //         selectedCountries: [...prevState.selectedCountries, value],
  //       };
  //     }
  //   });

  handleCountryChange = (event, country) => {
    const { value } = event.target;
    this.setState((prevState) => {
      if (prevState.country.selectedCountry.includes(value)) {
        return {
          country: {
            ...prevState.country,
            selectedCountry: prevState.country.selectedCountry.filter(
              (selectedCountry) => selectedCountry !== value
            ),
          },
        };
      } else {
        return {
          country: {
            ...prevState.country,
            selectedCountry: [...prevState.country.selectedCountry, value],
          },
        };
      }
    });
  }

  toggleCountryFirstQuestion = () => {
    this.setState(prevState => ({
      country: {
        ...prevState.country,
        countryFirstQuestion: !prevState.country.countryFirstQuestion,
      },
    }));
  }

//------------------ OPTIONS ----------------------------------  
  renderOptionsArea = () => {
    const { options,  gridOptions, requireResponse, isLeadingQuestion, questionList, allQuestions, validationErrors, openEndedWordLimit, openEndedWordCount } = this.state;
    const clearSelections = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedOptions = questionList.options.map((option) => ({
        ...option,
        text: '',
        isCorrect: false,
        recommendation: ''
      }));
      this.setState({ questionList: {...this.state.questionList, options: clearedOptions} });
    };

    const clearOptionsNextQuestion = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const clearedOptions = questionList.options.map((option) => ({
        ...option,
        optionsNextQuestion: '',
      }));
      this.setState({ 
        questionList: {
          ...questionList,
          options: clearedOptions
      }})
    };
    // const clearOptionsPreviousQuestion = (e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   const clearedOptions = questionList.options.map((option) => ({
    //     ...option,
    //     optionsPreviousQuestion: '',
    //   }));
    //   this.setState({ 
    //     questionList: {
    //       ...questionList,
    //       options: clearedOptions
    //   }})
    // };
    

    // Check when changing from a populated checkboxGrid to multipleChoiceGrid
    if (questionList.optionType === 'multipleChoiceGrid') {
      this.safeCheckMultipleChoiceGrid();
    };

    // Loading of Options
    switch (questionList.optionType) {
//----------------------------- multiple choice ----------------------------
      case "multipleChoice":
        
        // Multiple choice check: clear selection if more than one answer exists
        this.safeCheckMultipleChoice();
        
        return (
          <>
            
            {/* Options label */}
            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  name="options"
                  className="form-check-input"
                  id={`form-${option}Radio`}
                  value={`${option}`}
                  checked={option.isCorrect}
                  disabled={isLeadingQuestion}
                  onChange={() => this.selectOptionsRadio(index, !option.isCorrect)}
                />
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    id={`formOptions-${index}`}
                    className="form-control mx-2"
                    value={questionList.options[index].text}
                    onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                    // onChange={(e) => this.handleOptionChangeText(index, questionList.options[index].text, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: '1' }}
                  />
                  <input
              type="text"
              className="form-control mx-2"
              // value={questionList.options[index].recommendation}
              // value={this.state.recommendation}

              onChange={(e) => this.handleOptionRecommendationChange(index, e.target.value)}
              placeholder="Recommendation"
              style={{ flex: '1' }}
            />
                  {/* <RecommendationComponent  /> */}
                  
                  {console.log(this.props.name)}
                  {/* New input field for recommendation */}
          {/* <input
            type="text"
            className="form-control mx-2"
            placeholder="Recommendation"
            value={option.recommendation}
            onChange={(e) => this.handleOptionRecommendationChange(index, e.target.value)}
          /> */}
                  {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={questionList.options[index].optionsNextQuestion}
                        onChange={(e) => this.handleOptionsNextQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Question After this...</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )}
                  {/* {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={questionList.options[index].optionsPreviousQuestion}
                        onChange={(e) => this.handleOptionsPreviousQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Previous Question</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )} */}
                </div>
                {questionList.options.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteOption(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-dark" onClick={this.addOption}>
                Add option
              </button>
              {options.length > 0 && (
                <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                  Clear
                </button>
              )}
              {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsNextQuestion}>
                    Clear  Question After this..
                  </button>
                )}
              {/* {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsPreviousQuestion}>
                    Clear Previous Question
                  </button>
                )} */}
            </div>
          </>
        );
//----------------------------- checkbox ----------------------------      
      case "checkbox":
        return (
          <>
            {/* Options label */}
            console.log(----------------------------------------------);
            console.log(questionList);

            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type={'checkbox'}
                  className="form-check-input"
                  checked={option.isCorrect}
                  disabled={isLeadingQuestion}
                  onChange={() => this.toggleCorrectAnswer(index)}
                />
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    id={`formOptions-${index}`}
                    className="form-control mx-2"
                    value={questionList.options[index].text}
                    onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: '1' }}
                  />
                   {/* <RecommendationComponent/> */}
                  {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={option.optionsNextQuestion}
                        onChange={(e) => this.handleOptionsNextQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Question After this...</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )}
                  {/* {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={option.optionsPreviousQuestion}
                        onChange={(e) => this.handleOptionsPreviousQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Previous Question</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )} */}
                </div>
                {questionList.options.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteOption(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-dark" onClick={this.addOption}>
                Add option
              </button>
              {options.length > 0 && (
                <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                  Clear
                </button>
              )}
              {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsNextQuestion}>
                    Clear Question After this..
                  </button>
                )}
              {/* {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsPreviousQuestion}>
                    Clear Previous Question
                  </button>
                )} */}
            </div>
          </>
        );
  // ---------------------------- linear scale ----------------------------
      case 'linear':

        return (
          <div>
            <div className="mb-3 d-flex align-items-center">
              <select
                id="minScale"
                className="form-select me-2"
                value={questionList.linearScale[0].scale}
                onChange={(e) => this.handleLinearScaleValue(0, e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <span className="me-2">to</span>
              <select
                id="maxScale"
                className="form-select"
                value={questionList.linearScale[1].scale}
                onChange={(e) => this.handleLinearScaleValue(1, e.target.value)}
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <option key={i} value={i + 2}>
                    {i + 2}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {/* In the below map loop, the option parameter is required to compile */}
              {questionList.linearScale.map((option, index) => ( 
                <div key={index} className="d-flex align-items-center mb-2">
                  <span className="mr-2">{questionList.linearScale[index].scale} </span>
                  <input
                    type="text"
                    id={`label${index}`}
                    className="form-control mx-2"
                    value={this.state.questionList.linearScale[index].label}
                    onChange={(e) => this.handleLinearScaleLabelChange(index, e.target.value)}
                    placeholder={`Labels (Optional)`}
                  />
                  {/* <p>hint:</p>
                 <input type='text'
                  id={`label${index}`}
                  // className=''
                  className="form-control mx-2"
                  value={this.state.questionList.linearScale[index].recommendation}
                  onChange={(e) => this.handleOptionRecommendationChange(index, e.target.value)}
                  placeholder='Recommendation' 
                  //style={{flex: '1'}}
                  /> */}
                </div>
              ))}
            </div>
          </div>
        );
//----------------------------- dropdown ----------------------------     
      case 'dropdown':

        // Multiple choice check: clear selection if more than one answer exists
        this.safeCheckMultipleChoice();

        return (
          <>
            {questionList.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  disabled={isLeadingQuestion}
                  checked={option.isCorrect}
                  onChange={() => this.selectOptionsRadio(index, !option.isCorrect)}
                />
                <span className="mr-2">{index + 1}.</span>
                <div className="d-flex flex-grow-1 mx-2">
                  <input
                    type="text"
                    className="form-control mx-2"
                    value={option.text}
                    onChange={(e) => this.handleOptionChangeText(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: '1' }}
                  />
                    {/* <p>hint:</p>
                 <input type='text'
                  id={`formOptions-${index}`}
                  // className=''
                  className="form-control mx-2"
                  value={option.recommendation}
                  onChange={(e) => this.handleOptionRecommendationChange(index, e.target.value)}
                  placeholder='Recommendation' 
                  style={{flex: '1'}}
                  /> */}
                  {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={option.optionsNextQuestion}
                        onChange={(e) => this.handleOptionsNextQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Question After this...</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )}
                  {/* {isLeadingQuestion && (
                      <select
                        className="form-select mx-2"
                        style={{ flex: '1' }}
                        value={option.optionsPreviousQuestion}
                        onChange={(e) => this.handleOptionsPreviousQuestionChange(index, e.target.value)}
                      >
                        <option value="">Select Previous Question</option>
                        {allQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    )} */}
                </div>
                {questionList.options.length > 1 && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => this.deleteOption(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-dark" onClick={this.addOption}>
                Add option
              </button>
              {options.length > 0 && (
                <button className="btn btn-outline-danger ms-2" onClick={clearSelections}>
                  Clear
                </button>
              )}
              {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsNextQuestion}>
                    Clear Question After this...
                  </button>
                )}
              {/* {isLeadingQuestion && (
                  <button className="btn btn-outline-danger ms-2" onClick={clearOptionsPreviousQuestion}>
                    Clear Previous Question
                  </button>
                )} */}
            </div>
          </>
        );
  // -------------------------------- Multiple choice grid / Checkbox grid ------------
      case 'multipleChoiceGrid':
      case 'checkboxGrid':
     
        const isSingleRow = gridOptions.rows.length === 1;
        
        return (
          <>
            <div className="scrollable-table-container">
            {validationErrors.grid && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.grid}
                  </div>
                )}
              <table>
                <thead>
                  <tr>
                    <th>Row/Column</th>
                    {gridOptions.columns.map((col, colIndex) => (
                      <th key={colIndex} className="text-center">
                        <div className="d-flex justify-content-between align-items-center"> {}
                          <input
                              type="text"
                              className="form-control"
                              value={col.text}
                              onChange={(e) => this.handleColumnChange(colIndex, e)}
                              placeholder={`Column ${colIndex + 1}`}
                          />
                          {/* <p>hint:</p>
                 <input type='text'
                  // className=''
                  className="form-control mx-2"
                  value={col.recommendation}
                  onChange={(e) => this.handleOptionRecommendationChange(colIndex, e)}
                  placeholder='Recommendation' 
                  /> */}
                          {gridOptions.columns.length > 1 && (
                            <div className="delete-column-btn">
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                type="button"
                                onClick={() => this.deleteGridColumn(colIndex)}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className={isSingleRow ? "last-column-no-space" : "last-column-space"}></th>
                  </tr>
                </thead>
                <tbody>
                  {gridOptions.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="grid-row-spacing">
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.text}
                          onChange={(e) => this.handleRowChange(rowIndex, e)}
                          placeholder={`Row ${rowIndex + 1}`}
                        />
                        {/* <p>hint:</p>
                 <input type='text'
                  //id={`formOptions-${index}`}
                  // className=''
                  className="form-control mx-2"
                  value={row.recommendation}
                  onChange={(e) => this.handleOptionRecommendationChange(rowIndex, e)}
                  placeholder='Recommendation' 
                  //style={{flex: '1'}}
                  /> */}
                      </td>
                      {gridOptions.columns.map((_, colIndex) => {
                        const isCorrect = gridOptions.answers.some(answer => answer.rowIndex === rowIndex && answer.columnIndex === colIndex && answer.isCorrect);
                        return (
                          <td key={colIndex}>
                            <input
                              type={questionList.optionType === 'multipleChoiceGrid' ? 'radio' : 'checkbox'}
                              className="form-check-input"
                              name={`row-${rowIndex}`}
                              checked={isCorrect}
                              onChange={() => this.toggleGridAnswer(rowIndex, colIndex)}
                              disabled={isLeadingQuestion}
                            />
                          </td>
                        );
                      })}
                      <td className={isSingleRow ? "last-column-no-space" : "last-column-space"}>
                        {!isSingleRow && (
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            onClick={() => this.deleteGridRow(rowIndex)}
                          >
                            &times;
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-outline-dark" onClick={this.addGridRow}>
                Add Row
              </button>
              <button className="btn btn-outline-dark mx-2" onClick={this.addGridColumn}>
                Add Column
              </button>
              <button className="btn btn-outline-danger ms-2" onClick={this.clearGridSelections}>
                Clear
              </button>
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="requireResponseSwitch"
                  checked={requireResponse}
                  onChange={this.toggleRequireResponse}
                />
                <label className="form-check-label" htmlFor="requireResponseSwitch">
                  Require a response in each row
                </label>
              </div>
              </div>
          </>
        ); 


      case "openEnded":

        return (
          <>

            <label htmlFor="question" className="col-form-label">
              Content:
            </label>
            <div>
              <InputGroup>
                <Form.Control 
                  id="formOpenEnded"
                  as="textarea" 
                  aria-label="With textarea"
                  value={questionList.openEndedText}
                  onChange={this.handleOpenEndedText}
                />
              </InputGroup>
              <p
                style={{ color: openEndedWordCount > openEndedWordLimit ? 'red' : 'inherit' }} // Set color based on condition
              >
                Words: {openEndedWordCount}/{openEndedWordLimit}
              </p>
              {validationErrors.openEnded && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.openEnded}
                  </div>
                )}
            </div>
          </>
        );

      default:
        return null;
    }
  };  

  toggleCountryDropdown = () => {
    this.setState(prevState => ({
      showCountry: !prevState.showCountry
    }));
  };

  toggleLeadingQuestion = () => {
    this.setState(prevState => ({
      isLeadingQuestion: !prevState.isLeadingQuestion
    }));
  };

  toggleExplanation = () => {
    this.setState((prevState) => ({
      showExplanation: !prevState.showExplanation,
    }));
  };

  toggleRequireResponse = () => {
    this.setState(prevState => ({
      requireResponse: !prevState.requireResponse,
    }));
  };

  selectOptionsRadio = (index, value) => {
    this.setState((prevState) => ({
      questionList: {
        ...prevState.questionList,
        options: prevState.questionList.options.map((option, i) =>
          i === index ? { ...option, isCorrect: value } : {...option, isCorrect: false}
        ),
      },
    }));
  }

  toggleGridAnswer = (rowIndex, colIndex) => {
    const { questionList, gridOptions } = this.state;
  
    if (questionList.optionType === 'checkboxGrid') {
      const answerIndex = gridOptions.answers.findIndex(
        (answer) => answer.rowIndex === rowIndex && answer.columnIndex === colIndex
      );
    
      // If answer exists, delete it
      if (answerIndex > -1) {
        gridOptions.answers.splice(answerIndex, 1);
      } else {
        // If answer doesn't exist, add it
        gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true });
      }

      this.setState( { gridOptions } );
        
    } else if (questionList.optionType === 'multipleChoiceGrid') {
      // Find any existing answer for the same row and remove it
      const answerIndex = gridOptions.answers.findIndex(
        (answer) => answer.rowIndex === rowIndex
      );
      if (answerIndex > -1) {
        gridOptions.answers.splice(answerIndex, 1);
      }
  
      // Add the new answer with isCorrect set to true
      gridOptions.answers.push({ rowIndex, columnIndex: colIndex, isCorrect: true });
  
      this.setState( { gridOptions } );
    }
  };
 
  toggleCorrectAnswer = (index) => {
    const { questionList } = this.state;
  
    if (questionList.optionType === 'checkbox') {
      this.setState(prevState => ({
        questionList: {
          ...prevState.questionList,
          options: prevState.questionList.options.map((option, i) => {
            if (i === index) {
              return { ...option, isCorrect: !option.isCorrect };
            }
            return option;
          })
        }
      }));
    } else if (questionList.optionType === 'dropdown') {
      this.setState(prevState => ({
        options: prevState.options.map((option, i) => ({
          ...option,
          isCorrect: i === index,
        })),
      }));
    } else if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      this.setState((prevState) => ({
        gridOptions: {
          ...prevState.gridOptions,
          column: prevState.gridOptions.columns.map((col, i) => {
            if (i === index) {
              return { ...col, isCorrect: !col.isCorrect };
            }
            return col;
          }),
        },
      }));
    }
  };

  // --------------- VALIDATIONS---------------------------------

  validateTitleSelect = () => {
    const { selectedTitle } = this.state;
    // console.log('selectedTitle: ', selectedTitle)
    if (
      selectedTitle.trim() === '' || 
      selectedTitle.trim() === 'Select Title'
      ) {
        return false
    } else {
      return true
    };
  };
  validateFirstQuestionSubTitle = () => {
    const { allQuestions, subTitle } = this.state;

    // Case: when sub title IS NOT selected, 
    // is not possible as only way to execute this function is when a 
    // sub title is currently selected

    for (let i=0; i<allQuestions.length; i++) {
      
      // Case: same sub title AND first question is false
      if (
        subTitle.id === allQuestions[i].subTitle.id && 
        allQuestions[i].subTitle.firstQuestion === false
      ) {
        // do nothing, as want to ensure loop through entire array, 
        // if nothing found, after loop is done will return isSubTitleFirstQuestionVacant: true
      }

      // Case: same sub title AND first question is true
      else if (
        subTitle.id === allQuestions[i].subTitle.id && 
        allQuestions[i].subTitle.firstQuestion === true
      ) {
        // record the matched question
        this.setState({
          subTitleFirstQuestionId: allQuestions[i]._id,
          subTitleFirstQuestionValue: allQuestions[i].question
        })
        return {
          isSubTitleFirstQuestionVacant: false
        };
      }
    }

    // Case: subTitle.id doesn't match with any in the subTitle object array
    // return vacant status
    return {
      isSubTitleFirstQuestionVacant: true
    };
  };
  validateFirstQuestionNestedTitle = () => {
    const { allQuestions, nestedTitle } = this.state;

    // Case: when nested title IS NOT selected, 
    // is not possible as only way to execute this function is when a 
    // nested title is currently selected

    for (let i=0; i<allQuestions.length; i++) {
      
      // Case: same nested title AND first question is false
      if (
        nestedTitle.id === allQuestions[i].nestedTitle.id && 
        allQuestions[i].nestedTitle.firstQuestion === false
      ) {
        // do nothing, as want to ensure loop through entire array, 
        // if nothing found, after loop is done will return isNestedTitleFirstQuestionVacant: true
      }

      // Case: same nested title AND first question is true
      else if (
        nestedTitle.id === allQuestions[i].nestedTitle.id && 
        allQuestions[i].nestedTitle.firstQuestion === true
      ) {
        // record the matched question
        this.setState({
          nestedTitleFirstQuestionId: allQuestions[i]._id,
          nestedTitleFirstQuestionValue: allQuestions[i].question
        })
        return {
          isNestedTitleFirstQuestionVacant: false
        };
      }
    }

    // Case: nestedTitle.id doesn't match with any in the nestedTitle object array
    // return vacant status
    return {
      isNestedTitleFirstQuestionVacant: true
    };
  };
  
  validateQuestion = () => {
    const { questionList } = this.state;
    return questionList.question.trim() !== '';
  };
  
  validateOptionType = () => {
    const { questionList } = this.state;
    return questionList.optionType !== '';
  };
  
  validateOptions = () => {
    const { questionList, isLeadingQuestion } = this.state;
    if (questionList.optionType === 'linear' || questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      return true;
    }

    // Check a minimum of one selection is made
    let minSelection = false;
    // If leading question, then selection is disabled,
    // hence cannot make minimum selection, 
    // so in the else statement (isLeadingQuestion is true)
    // make it so minSelection is set true
    if (!isLeadingQuestion) {
      for (let i=0; i<questionList.options.length; i++) {
        if (questionList.options[i].isCorrect) {
          return minSelection = true
        }
      }
    } else {
      minSelection = true
    }
    
    return questionList.options.length >= 2 && minSelection === true;
  };

  validateGrid = () => {
    
    const { questionList, gridOptions, isLeadingQuestion } = this.state;

    if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
        // Check a label has been assigned for each row
      for (let i=0; i<gridOptions.rows.length; i++) {
        if (gridOptions.rows[i].text === '') {
          return false
        }
      }
      // Check a label has been assigned for each column
      for (let i=0; i<gridOptions.columns.length; i++) {
        if (gridOptions.columns[i].text === '') {
          return false
        }
      }
      // Catch minimum number of answers is less than number of rows
      // Applies when NOT a leading question
      if (!isLeadingQuestion) {
        if (gridOptions.answers.length < gridOptions.rows.length) {
          return false
        } else {
          return true
        }
      }
    }
    return true;
  };

  validateOpenEnded = () => {
    const { questionList, openEndedWordCount, openEndedWordLimit } = this.state;

    if (questionList.optionType === 'openEnded') {
      // code below
      if (openEndedWordCount > openEndedWordLimit) {
        // case when openEndedWordCount GREATER THAN openEndedWordLimit
        return false;
      } else {
        // case when openEndedWordCount LESS THAN OR EQUALS openEndedWordLimit
        return true;
      }
    };
    
    // case when optionType IS NOT 'openEnded'
    return true;
  }
  
  validateMarks = () => {
    const { questionList, isLeadingQuestion } = this.state;
    return isLeadingQuestion || (questionList.marks !== '' && !isNaN(questionList.marks));
  };
  
  
  validateExplanation = () => {
    const { explanation, showExplanation } = this.state;
    return !showExplanation || explanation.trim() !== '';
  };

  validateCountry = () => {
    const { country, showCountry } = this.state;
    // Case: when "Specific Country" is switched on
    if (showCountry) {
      // Case: when a selectedCountry has been set
      if (country.selectedCountry) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  };

  validateCountryFirstQuestion = () => {
    const { allQuestions, country } = this.state;

    for (let i=0; i < allQuestions.length; i++){
      // Case: same country AND first question exists
      if (
        country.selectedCountry === allQuestions[i].country.selectedCountry && 
        allQuestions[i].country.countryFirstQuestion === true
      ) {
          console.log(`A first question already exists: ${allQuestions[i].country.selectedCountry}`)
          this.setState({
            countryFirstQuestionId: allQuestions[i]._id,
            countryFirstQuestionValue: allQuestions[i].question
          });
        return { 
          exists: true, 
          id: allQuestions[i]._id, 
          value: allQuestions[i].question, 
          countryValue: allQuestions[i].country.selectedCountry, 
          countryFirstQuestionBoolean: allQuestions[i].country.countryFirstQuestion
        };
      } else {
        console.log(`A country first question is vacant`)
      }
    };
    return { exists: false, id: null, value: null };
  };
  
  renderToast() {
    if (this.state.showToast) {
      return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-dark text-white">
            <div className="d-flex justify-content-between">
              <div className="toast-body">
                Edited question successfully!
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => this.setState({ showToast: false })}></button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // -------------------------- HANDLE SUBMIT ------------------------------

  handleSubmit = async (e) => {
    e.preventDefault();

    const isTitleSelectValid = this.validateTitleSelect();
    const isQuestionValid = this.validateQuestion();
    const isOptionTypeValid = this.validateOptionType();
    const isOptionsValid = this.validateOptions();
    const isOpenEndedValid = this.validateOpenEnded();
    const isMarksValid = this.validateMarks();
    const isExplanationValid = this.validateExplanation();
    const isGridValid = this.validateGrid();
    const isCountryValid = this.validateCountry();
    // const {recommendation} = this.state;
    // console.log("Recommendation submitted:", recommendation);
    // console.log(this.state.details);
    if(!isTitleSelectValid){
      console.log('Title not selected');
      return;
    }

    this.setState({
      validationErrors: {
        title: isTitleSelectValid ? '' : 'Select a title',
        question: isQuestionValid ? '' : 'Enter the question',
        optionType: isOptionTypeValid ? '' : 'Select an option type',
        grid: isGridValid ? '' : 'Complete all grid data entry and ensure there is one selection per row',
        options: isOptionsValid ? '' : 'Add at least two options and at least one selection',
        openEnded: isOpenEndedValid  ? '' : 'Ensure entry is less than the word limit',
        marks: isMarksValid ? '' : 'Enter the marks (an integer value) for this question',
        explanation: isExplanationValid ? '' : (this.state.isLeadingQuestion ? 'Enter the recommendation for this question' : 'Enter the explanation for the correct answer'),
        country: isCountryValid ? '' : 'Select at least one country',
      },
    });

    if (
      !isQuestionValid || 
      !isOptionTypeValid || 
      !isGridValid || 
      !isOptionsValid || 
      !isOpenEndedValid ||
      !isMarksValid || 
      !isExplanationValid ||
      !isCountryValid
    ) {
      return;
    }

    const {
      //previousQuestion,
      nextQuestion,
      gridOptions,
      isLeadingQuestion,
      showCountry,
      selectedCountry,
      explanation,
      showExplanation,
      requireResponse,
      questionList,
      questionId,
      selectedTitle,
      showFirstQuestionNestedTitleOption,
      showFirstQuestionSubTitleOption,
      nestedTitle,
      subTitle
    } = this.state;

    const dataToUpdate = {
      titleId: selectedTitle,
      question: questionList.question,
      optionType: questionList.optionType,
      options: questionList.options,
      grid: gridOptions,
      linearScale: questionList.linearScale,
      openEndedText: questionList.openEndedText,
      marks: isLeadingQuestion ? undefined : parseFloat(questionList.marks),
      countries: showCountry ? selectedCountry : undefined,
      explanation: showExplanation ? explanation : undefined,
      isLeadingQuestion,
      showCountry,
      country: showCountry ? selectedCountry : undefined,
      requireResponse,
      //previousQuestion: isLeadingQuestion ? undefined : questionList.previousQuestion,
      nextQuestion: isLeadingQuestion ? undefined : questionList.nextQuestion,
      nestedTitle: nestedTitle,
      subTitle: subTitle
    };

    // Leading Question Marks check
    if (isLeadingQuestion === true) {
      // Case when isLeadingQuestion is true, set marks to null
      dataToUpdate.marks = null
    }

    // Case: multiple choce / checkbox / dropdown
    if (questionList.optionType === 'multipleChoice' || questionList.optionType === 'checkbox' || questionList.optionType === 'dropdown') {
      dataToUpdate.options = questionList.options.map((option) => ({
        text: option.text,
        recommendation: option.recommendation,
        isCorrect: option.isCorrect || false,
        optionsNextQuestion: (isLeadingQuestion) ? option.optionsNextQuestion : null 
       // optionsPreviousQuestion: (isLeadingQuestion) ? option.optionsPreviousQuestion : null
      }));
    }
  
    if (questionList.optionType === 'linear') {
      dataToUpdate.linearScale = questionList.linearScale.map((option) => ({
        scale: option.scale,
        label: option.label,
        recommendation: option.recommendation
      }));
    } else {
      // clear linearScale
      dataToUpdate.linearScale = []
    }

    if (questionList.optionType === 'multipleChoiceGrid' || questionList.optionType === 'checkboxGrid') {
      dataToUpdate.grid = {
        rows: gridOptions.rows.map(rows => ({ text: rows.text ,recommendation: rows.recommendation})),
        columns: gridOptions.columns.map(columns => ({ text: columns.text ,recommendation: columns.recommendation})),
        answers: gridOptions.answers.filter(answer => answer.isCorrect)
      };
    } else {
      // clear grid
      dataToUpdate.grid = { rows: [], columns: [], answers: [] }
    }

    // Update database server API
    this.updateQuestion(questionId, dataToUpdate)
  };

/*---------------------RENDER----------------------------------*/

  render() {

    const { questionList,selectedTitle, selectedTitleQuestions, showCountry, countries, selectedCountry, isLeadingQuestion, showExplanation, validationErrors, questionId, questionIndex, allQuestions, allTitles, showModal, showFirstQuestionNestedTitleOption,showFirstQuestionSubTitleOption,subTitle, nestedTitle,nextQuestion,showNextQuestion,nestedTitleFirstQuestionRender,subTitleFirstQuestionRender, country } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';
    const { filteredQuestions } = this.state;
    // const { recommendation } = this.state;

    return (
      
      <div>
        
        <button 
          className="btn btn-primary" 
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler(questionId)}>
            Edit
        </button>

        <Modal
          show={showModal === true}
          onHide={() => this.setState({ showModal: false })}
          className="modal-lg"
          ref={this.editQuestionModalRef}
        >
          {/* Modal content */}
          <Modal.Header 
            className="modal-header"
            closeButton
          >
            <Modal.Title
              className="modal-title fs-5" 
              id="editQuestionLabel"
            >
              Edit Question
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
            {/* Select title dropdown */}
            <div className="mb-3">
                <label className="col-form-label">
                    Select title:
                </label>
                  <div className="d-flex align-items-left">
                    <div className="d-flex flex-grow-1">
                    <select
                      className="form-select"
                      style={{ flex: '1' }}
                      value={this.state.selectedTitle}
                      onChange={(e) => this.handleTitleSelect(e.target.value)}
                    >
                      <option value="">Select Title</option>
                      {/* title loop */}
                      {allTitles.map((titleObject) => (
                        <optgroup key={titleObject.title.titleLabel} label={"Title: " + titleObject.title.titleLabel}>
                          {/* Render subTitleLabel as options */}
                          {titleObject.title.subTitle.map((subTitleObject) => (
                            <React.Fragment key={subTitleObject._id}>
                              <option value={subTitleObject._id}>   {/*not necessary adding key*/}
                                {"Sub Title: " + subTitleObject.subTitleLabel}
                              </option>
                              {/* Render nestedTitleLabel as options */}
                        
                              {subTitleObject.nestedTitle.map((nestedTitleObject) => (
                                <option key={nestedTitleObject._id} value={nestedTitleObject._id}>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"Nested Title: " + nestedTitleObject.nestedTitleLabel} {/* Add one more level of indentation for nestedTitleLabel */}
                                </option>
                              ))}
                            </React.Fragment>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    </div>
                  </div>
              {validationErrors.title && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.title}
                </div>
              )}
            </div>
             {/* First Question Sub Title */}
             {/* {showFirstQuestionSubTitleOption && (
              <div className="form-check form-switch form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="subTitleFirstQuestionCheck"
                checked={subTitle.firstQuestion}
                onChange={this.toggleFirstQuestionSubTitle}
              />
              <label className="form-check-label" htmlFor="firstQuestionCheck">
                Sub Title's First Question
              </label>
                {subTitleFirstQuestionRender && (
                  <div>
                    {this.renderSubTitleFirstQuestionModal()}
                  </div>
                )}
              </div>
            )}   */}
            {/* First Question Nested Title */}
            {showFirstQuestionNestedTitleOption && (
              <div className="form-check form-switch form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="nestedTitleFirstQuestionCheck"
                checked={nestedTitle.firstQuestion}
                onChange={this.toggleFirstQuestionNestedTitle}
              />
              <label className="form-check-label" htmlFor="firstQuestionCheck">
                Nested Title's First Question
              </label>
                {nestedTitleFirstQuestionRender && (
                  <div>
                    {this.renderNestedTitleFirstQuestionModal()}
                  </div>
                )}
              </div>
            )}
                
            {/* Question label */}
            <div className="mb-3">
              <label htmlFor="question" className="col-form-label">
                Question:
              </label>
              <div>
                <input 
                  type="text" 
                  className="form-control" 
                  id="formQuestion" 
                  value={this.state.questionList.question}
                  onChange={this.handleQuestionText}
                />
              </div>
              {validationErrors.question && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.question}
                </div>
              )}
            </div>

            {/* Options Type */}
            <div className="mb-3">
              <label htmlFor="optionsType" className="col-form-label">
                Options Types:
              </label>
              <select
                className="form-select"
                id="formOptionsType"
                value={this.state.questionList.optionType}
                onChange={this.handleQuestionOptionType}
              >
                <option value="multipleChoice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
                <option value="dropdown">Dropdown</option>
                <option value="linear">Linear Scale</option>
                <option value="multipleChoiceGrid">Multiple Choice Grid</option>
                <option value="checkboxGrid">Checkbox Grid</option>
                <option value="openEnded">Open-Ended</option>
              </select>
              {validationErrors.optionType && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.optionType}
                </div>
              )}
            </div>
            
            {/* Options */}
            <div className="mb-3" id="optionsArea">
              {this.renderOptionsArea()}
              {validationErrors.options && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {validationErrors.options}
                </div>
              )}
            </div>
            {showExplanation && (
              <div className="mb-3">
                <label htmlFor="explanation" className="col-form-label">
                  {explanationLabel}:
                </label>
                <textarea className="form-control" id="explanation" value={this.state.explanation} onChange={this.handleInputChange}></textarea>
                {validationErrors.explanation && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Marks */}
            {!isLeadingQuestion && (
              <div className="mb-3">
                <label htmlFor="mark" className="col-form-label">
                  Marks:
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="formMarks" 
                  value={this.state.questionList.marks}
                  onChange={this.handleQuestionMarks} 
                />
                {validationErrors.marks && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.marks}
                  </div>
                )}
              </div>
            )}
            
            {/* Specific Country */}
            {showCountry && (
              <div className="mb-3">
                <label className="col-form-label">Country:</label>
                <div style={{ maxHeight: '130px', overflowY: 'auto'}}>
                  {countries.map((country, index) => (
                    <div key={index} className="form-check">
                      <input
                        type="checkbox"
                        id={country}
                        value={country}
                        checked={this.state.country.selectedCountry.includes(country)}
                        onChange={(event) => this.handleCountryChange(event,country)}
                        className="form-check-input"
                        size={8}
                      />
                      <label htmlFor={country} className="form-check-label">
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
                {validationErrors.country && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.country}
                  </div>
                )} 

              {/* Country First Question */}
              <p></p>
              <div className="form-check form-switch form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="countryFirstQuestionCheck"
                checked={country.countryFirstQuestion}
                onChange={this.toggleCountryFirstQuestion}
              />
              <label className="form-check-label" htmlFor="firstQuestionCheck">
                First Question
              </label>
              {validationErrors.countryFirstQuestion && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.countryFirstQuestion}
                  </div>
                )}
                {/* {countryFirstQuestionRender && (
                  <div>
                    {this.renderCountryFirstQuestionModal()}
                  </div>
                )}  */}
              </div>

              </div>
            )}
{/*testing */}
             {/* Previous Question */}
             {/* {showNextQuestion && selectedTitle && (
                    <div className="mb-3">
                      <label htmlFor="previousQuestion" className="col-form-label">Previous Question:</label>
                      <select
                        className="form-select"
                        id="previousQuestion"
                        value={previousQuestion}
                        onChange={(e) => this.setState({ previousQuestion: e.target.value })}
                      >
                        <option value="">Select Previous Question</option>
                        {selectedTitleQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    
                    {/* Next Question }
                      <label htmlFor="nextQuestion" className="col-form-label">Next Question:</label>
                      <select
                        className="form-select"
                        id="nextQuestion"
                        value={nextQuestion}
                        onChange={(e) => this.setState({ nextQuestion: e.target.value })}
                      >
                        <option value="">Select Next Question</option>
                        {selectedTitleQuestions.map((question) => (
                          <option key={question._id} value={question._id}>
                            {question.question}
                          </option>
                        ))}
                      </select>
                    </div>
                  )} */}
            {/*previous question*/}
            {/* {!isLeadingQuestion && filteredQuestions && (
              <div className="mb-3">
                <label htmlFor="previousQuestion" className="col-form-label">
                  Previous Question:
                </label>
                <select
                  className="form-select"
                  id="previousQuestion"
                  value={this.state.questionList.previousQuestion}
                  onChange={this.handleQuestionPreviousQuestion}
                >
                  <option value="">Select previous Question</option>
                  {filteredQuestions
                    .filter(question => !question.firstQuestion && !this.isOptionPreviousQuestionUsed(question))
                    .map((question) => (
                      <option key={question._id} value={question._id}>
                        {question.question}
                      </option>
                    ))}
                </select>
              </div>
            )} */}
            {/* Next Question */}
            {!isLeadingQuestion && filteredQuestions && (
              <div className="mb-3">
                <label htmlFor="nextQuestion" className="col-form-label">
                  Question After this....:
                </label>
                <select
                  className="form-select"
                  id="nextQuestion"
                  value={this.state.questionList.nextQuestion}
                  onChange={this.handleQuestionNextQuestion}
                >
                  <option value="">Select Question After this...</option>
                  {filteredQuestions
                    .filter(question =>  !question.firstQuestion && !this.isOptionNextQuestionUsed(question))
                    .map((question) => (
                      <option key={question._id} value={question._id}>
                        {question.question}
                      </option>
                    ))}
                </select>
              </div>
            )}
            </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              <div className="form-check form-switch form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="specific"
                  checked={showCountry}
                  onChange={this.toggleCountryDropdown}
                />
                <label className="form-check-label" htmlFor="specific">
                  Specific Country
                </label>
              </div>
              <div className="form-check form-switch form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="leading"
                  checked={isLeadingQuestion}
                  onChange={this.toggleLeadingQuestion}
                />
                <label className="form-check-label" htmlFor="leading">
                  Leading Question
                </label>
              </div>
              <div className="form-check form-switch form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="explanationCheck"
                  checked={showExplanation}
                  onChange={this.toggleExplanation}
                />
                <label className="form-check-label" htmlFor="explanationCheck">
                  {explanationLabel}
                </label>
              </div>
            </div>
            <button type="button" className="btn btn-dark" onClick={(e) => this.handleSubmit(e)}>
            Submit
            </button>
            {/* <Questions details={this.state.details} /> */}
          </div>
        </Modal.Footer>
        </Modal>

        {this.renderToast()}

        <div 
          className="modal fade" 
          id={`editQuestion`}
          tabIndex="-1" 
          aria-labelledby="editQuestionLabel" 
          aria-hidden="true" 
          ref={this.editQuestionModalRef}
        >
        </div>
      </div>
    );
  }
}

export default EditQuestion;