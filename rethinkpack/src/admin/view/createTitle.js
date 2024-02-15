import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Modal from 'react-bootstrap/Modal';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

class CreateTitle extends Component {
  constructor(props) {
    super(props);
    // Declare all state variables to observe below
    this.state = {
      title: {
        titleLabel: '',
        subTitle: [
          {
            subTitleLabel: '',
            nestedTitle: [{ nestedTitleLabel: '' }]
          }
        ],
      },
      question: '',
      validationErrors: {
        questionType: '',
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
      allQuestions: [],
      questionList: {
        question: null,
        questionType: '',
        optionType: 'multipleChoice',
        options: [{ label: 'Option 1', value: 'Option 1', isCorrect: false, optionsNextQuestion: null }],
        linearScale: [],
        openEndedText: '',
        marks: '',
        firstQuestion: false,
        nextQuestion: null
      },
      openEndedWordLimit: 500,
      openEndedWordCount: 0,
      stateQuestionId: '',
      showModal: false,
    };

    this.initialState = { ...this.state };
    this.resetState = this.resetState.bind(this);
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.onEditClickHandler = this.onEditClickHandler.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
  }

  resetState() {
    this.setState({
      ...this.initialState,
      showToast: this.state.showToast
    });
  }

  /*--------------onClick-----------------*/

  onEditClickHandler = (id) => {
    // Load all questions
    this.fetchQuestions().then(
      // Load specific question
      this.fetchQuestion(id)
    );
  }

  /*--------------API-----------------*/

  fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/read/${questionId}`);
      const data = await response.json();
      if (data) {
        this.setState({
          showModal: true,
          questionList: data,
          selectedOption: data.optionType,
          gridOptions: data.grid,
          isLeadingQuestion: (data.marks) ? false : true
        })
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

  updateQuestion = async (questionId, dataToUpdate) => {
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

  /*-------------MODAL-----------------*/

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  /*----------- function helpers ----------------------*/

  //
  handleTitleLabel = (e) => {
    this.setState((prevState) => ({
      title: { ...prevState.title, titleLabel: e.target.value }
    }))
  };

  handleSubTitleLabel = (index, value) => {
    const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: title.subTitle.map((subTitleElem, i) =>
          i === index ? { ...subTitleElem, subTitleLabel: value } : subTitleElem
        ),
      },
    }));
  };

  handleNestedTitleLabel = (index_sub, index_nest, value) => {
    const { title } = this.state;
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
          i === index_sub
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle.map((nestedTitleElem, j) =>
                j === index_nest ? { ...nestedTitleElem, nestedTitleLabel: value } : nestedTitleElem
              ),
            }
            : subTitleElem
        ),
      },
    }));
  };

  addSubTitle = (e) => {
    e.preventDefault();
    e.stopPropagation()
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: [
          ...prevState.title.subTitle,
          { subTitleLabel: "", nestedTitle: [{ nestedTitleLabel: '' }] }
        ]
      }
    }));
  };

  deleteSubTitle = (index) => {
    this.setState(prevState => ({
      title: { ...prevState.title, subTitle: prevState.title.subTitle.filter((_, i) => i !== index) }
    }));
  };

  addNestedTitle = (subtitleIndex, e) => {
    e.preventDefault(); // Prevent the default action of the button click (accidental form submission)
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: [
                ...subTitleElem.nestedTitle,
                { nestedTitleLabel: '' },
              ],
            }
            : subTitleElem
        ),
      },
    }));
  };

  deleteNestedTitle = (subtitleIndex, nestedTitleIndex) => {
    this.setState((prevState) => ({
      title: {
        ...prevState.title,
        subTitle: prevState.title.subTitle.map((subTitleElem, i) =>
          i === subtitleIndex
            ? {
              ...subTitleElem,
              nestedTitle: subTitleElem.nestedTitle.filter((_, j) => j !== nestedTitleIndex)
            }
            : subTitleElem
        )
      }
    }));
  };

  // --------------- VALIDATIONS---------------------------------

  validateQuestionType = () => {
    const { questionList } = this.state;
    return questionList.questionType !== '';
  };

  validateQuestion = () => {
    const { questionList } = this.state;
    return questionList.question.trim() !== '';
  };

  validateOptionType = () => {
    const { questionList } = this.state;
    return questionList.optionType !== '';
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

    const { title } = this.state

    // const isQuestionTypeValid = this.validateQuestionType();
    // const isQuestionValid = this.validateQuestion();

    // this.setState({
    //   validationErrors: {
    //     questionType: isQuestionTypeValid ? '' : 'Select one question type',
    //     question: isQuestionValid ? '' : 'Enter the question'
    //   },
    // });

    // if (
    //   !isQuestionTypeValid || 
    //   !isQuestionValid || 
    //   !isOptionTypeValid || 
    //   !isGridValid || 
    //   !isOptionsValid || 
    //   !isMarksValid || 
    //   !isCountriesValid || 
    //   !isExplanationValid
    // ) {
    //   return;
    // }

    // const dataToUpdate = {
    //   questionType: this.state.questionList.questionType,
    //   question: this.state.questionList.question,
    //   optionType: this.state.questionList.optionType,
    //   options: this.state.questionList.options,
    // };

    // Update database server API
    // this.updateQuestion(questionId, dataToUpdate)

    // debug
    // print title label
    console.log(`titleLabel: ${this.state.title.titleLabel}`)

    // print labels
    for (let i = 0; i < title.subTitle.length; i++) {

      // subtitle labels
      console.log(`subtitleLabel[${i}]: ${title.subTitle[i].subTitleLabel}`)

      // nested title labels
      for (let j = 0; j < title.subTitle[i].nestedTitle.length; j++) {
        console.log(`nestedLabel[${i}][${j}]: ${title.subTitle[i].nestedTitle[j].nestedTitleLabel}`)
      }
    }
    //
  };

  /*---------------------RENDER----------------------------------*/

  render() {

    const { showCountry, isLeadingQuestion, showExplanation, validationErrors, questionId, questionIndex, allQuestions, title } = this.state;
    const explanationLabel = isLeadingQuestion ? 'Recommendation' : 'Explanation';

    return (

      <div>

        <button
          // className="btn btn-primary"
          className="btn btn-dark d-none d-md-inline-block"
          id={`btEdit-${questionIndex}`}
          onClick={() => this.onEditClickHandler(questionId)}>
          Create Title
        </button>

        <Modal
          show={this.state.showModal === true}
          onHide={() => {
            this.setState({ showModal: false },
              this.resetState
            )
          }
          }
          className="modal-lg"
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
              Create Title
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              {/* Title 0 */}
              <div className="mb-3">
                <label htmlFor="question" className="col-form-label">
                  Title:
                </label>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    id="formQuestion"
                    value={this.state.title.titleLabel}
                    onChange={this.handleTitleLabel}
                  />
                </div>
                {validationErrors.question && (
                  <div style={{ color: 'red', fontSize: 12 }}>
                    {validationErrors.question}
                  </div>
                )}
              </div>
              {/* SubTitle loop */}
              {this.state.title.subTitle.map((subTitleElem, index) => (
                <ul>
                  {/* Title 1 */}
                  <li key={`sub_${index}`}>
                    <div className="mb-3 d-flex align-items-center mb-2">
                      <label htmlFor="question" className="col-form-label">
                        Subtitle:
                      </label>
                      <div className="d-flex flex-grow-1 mx-2">
                        <input
                          type="text"
                          className="form-control mx-2"
                          id="formSubTitle"
                          value={title.subTitle[index].subTitleLabel}
                          onChange={(e) => this.handleSubTitleLabel(index, e.target.value)}
                        />
                        {/* {validationErrors.question && (
                        <div style={{ color: 'red', fontSize: 12 }}>
                          {validationErrors.question}
                        </div>
                      )} */}
                      </div>
                      {title.subTitle.length > 1 && (
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => this.deleteSubTitle(index)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </li>
                  {/* Nested Title Loop */}
                  {subTitleElem.nestedTitle && subTitleElem.nestedTitle.map((nestedTitleElem, index_nest) => (
                    <ul>
                      <li key={`nest_${index}_${index_nest}`}>
                        {/* Title 2 */}
                        <div className="mb-3 d-flex align-items-center mb-2">
                          <label htmlFor="question" className="col-form-label">
                            Nested Title:
                          </label>
                          <div className="d-flex flex-grow-1 mx-2">
                            <input
                              type="text"
                              className="form-control mx-2"
                              id="formNestedTitle"
                              value={title.subTitle[index].nestedTitle[index_nest].nestedTitleLabel}
                              onChange={(e) => this.handleNestedTitleLabel(index, index_nest, e.target.value)}
                            />
                          </div>
                          {/* {validationErrors.question && (
                      <div style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.question}
                      </div>
                    )} */}
                          {/* Delete nestedTitle */}
                          {title.subTitle[index].nestedTitle.length > 1 && (
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => this.deleteNestedTitle(index, index_nest)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </li>
                    </ul>
                  ))}
                  {/* Add nestedTitle */}
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-dark"
                      onClick={(e) => this.addNestedTitle(index, e)}
                    >
                      Add nested title
                    </button>
                  </div>
                </ul>
              ))}
              {/* Add subTitle button */}
              <div className="d-flex align-items-center">
                <button className="btn btn-outline-dark" onClick={this.addSubTitle}>
                  Add subtitle
                </button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100">

              <div className="form-check form-switch form-check-inline">
              </div>
              <button type="button" className="btn btn-dark" onClick={this.handleSubmit}>
                Submit
              </button>
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
        >
        </div>
      </div>
    );
  }
}

export default CreateTitle;