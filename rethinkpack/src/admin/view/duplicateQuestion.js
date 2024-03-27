const duplicateQuestion = (question) => {
    // Create a deep copy of the question object
    const duplicatedQuestion = JSON.parse(JSON.stringify(question));

    // Remove properties that should not be duplicated
    delete duplicatedQuestion._id; // Remove question ID
    delete duplicatedQuestion.nextQuestion; // Remove next question ID
    delete duplicatedQuestion.optionsNextQuestion; // Remove options next question IDs

    // You can also modify other properties as needed

    return duplicatedQuestion;
};

export default duplicateQuestion;