const duplicateQuestion = (question) => {
    // Create a deep copy of the question object
    const duplicatedQuestion = JSON.parse(JSON.stringify(question));
    
    // Adding a duplicate to let the user know its the duplicate question
    duplicatedQuestion.question += " (duplicate)"; // Add "(duplicate)" to the question

    // Remove properties that should not be duplicated
    delete duplicatedQuestion._id; // Remove question ID
    delete duplicatedQuestion.nextQuestion; // Remove next question ID
    delete duplicatedQuestion.previousQuestion; // Remove previous question ID
    delete duplicatedQuestion.optionsNextQuestion; // Remove options next question IDs

    // You can also modify other properties as needed
    // console.log("Inside duplicateQuestion.js")
    return duplicatedQuestion;
    
};

export default duplicateQuestion;