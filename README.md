# ReThinkPack Recycling Calculator Tool

This **Rethinkpack** is designed to assist companies in assessing the recyclability of their products, especially when entering new international markets.

## Getting Started

### Prerequisites
- MongoDB Community Server
- Node.js and npm
- ReactJS
- ExpressJS
- Mongoose
- CSS, HTML, JavaScript
- Linux Ubuntu 22.04 (for server and testing environment)

**Installation**

All below commands are run at root directory `*/rethinkpack> command`. All commands can be viewed at root level `package.json` under `scripts` section.

1. Locate the project directory.

        cd rethinkpack
   
2. Install the dependencies by navigate to the project directory and run.
   
        npm install
   
3. Start the react js

        npm start

## Common Errors

- **Mongoose Dependency Error**

  If you see an error related to Mongoose

        npm install mongoose.

- **No Such File or Directory**

  Cannot read package.json which related to to npm not being able to find a file

        cd rethinkpack

## Task List 📌

**Admin**
- HTML for:
    - Create Question
      - Add new question ✔
      - Navigate to next question 
    - Display Question
      - Display all the questions
      - The sequence to display the question
    - Edit Question
      - Edit the question
      - Delete the question 
- Backend for (Database):
    - Add Question ✔
    - Display Question
    - Edit Question
    - Delete Question

**User**
- HTML for:
    - Questions
- Backend for (Database):
    - Display Questions  
    - Save response  
