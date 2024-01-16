// import React, { useEffect, useState } from 'react';
// import Tree from 'react-d3-tree';
// import './questionsTreeMap.css';

// const QuestionsTreeMap = () => {
//     const [questions, setQuestions] = useState([]);
//     const [translate, setTranslate] = useState({ x: 0, y: 0 });

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await fetch('http://rtp.dusky.bond:5000/api/displayQuestions');
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setQuestions(data);
//             } catch (error) {
//                 console.error("Error fetching questions:", error);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     useEffect(() => {
//         const handleResize = () => {
//             const container = document.querySelector('.questions-tree-map-container');
//             if (container) {
//                 const containerWidth = container.offsetWidth;
//                 setTranslate({ x: containerWidth / 2, y: 100 });
//             }
//         };

//         handleResize();

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const renderCustomNode = ({ nodeDatum, toggleNode }) => {
//         return (
//             <foreignObject width={200} height={150} x={-100} y={-75} onClick={() => toggleNode()}>
//                 <div className="node-container">
//                     <h4>{nodeDatum.name}</h4>
//                     {/* Add other details and interactive elements */}
//                 </div>
//             </foreignObject>
//         );
//     };

//     const organizeQuestions = (questions) => {
//         const questionMap = {};
//         questions.forEach(question => {
//             questionMap[question._id] = { ...question, name: question.question, children: [] };
//         });
    
//         const buildTree = (questionId, visited = new Set()) => {
//             if (visited.has(questionId)) {
//                 console.error("Cycle detected in question links");
//                 return;
//             }
    
//             visited.add(questionId);
    
//             const question = questionMap[questionId];
//             if (question.nextQuestion && questionMap[question.nextQuestion]) {
//                 question.children.push(buildTree(question.nextQuestion, visited));
//             }
//             question.options?.forEach(option => {
//                 if (option.optionsNextQuestion && questionMap[option.optionsNextQuestion]) {
//                     question.children.push(buildTree(option.optionsNextQuestion, visited));
//                 }
//             });
    
//             return question;
//         };
    
//         return questions.filter(question => !question.previousQuestion).map(question => buildTree(question._id));
//     };

//     const renderTreeMap = () => {
//         const root = organizeQuestions(questions);
//         const containerWidth = document.querySelector('.questions-tree-map-container').offsetWidth;
//         const translate = { x: containerWidth / 2, y: 100 };

//         if (!root || root.length === 0) {
//             root = [{ name: "No Questions Available", children: [] }];
//         }    

//         return (
//             <Tree data={root} orientation="vertical" translate={translate} nodeSize={{ x: 200, y: 200 }} separation={{ siblings: 1, nonSiblings: 1.5 }} renderCustomNodeElement={renderCustomNode} />
//         );
//     };

//     return (
//         <div className="questions-tree-map-container">
//             {questions.length > 0 ? renderTreeMap() : <p>Loading questions...</p>}
//         </div>
//     );
// };

// export default QuestionsTreeMap;
// ---------------------------------------------------------------------------------------------- The below one deals with duplication
// import React, { useEffect, useState } from 'react';
// import Tree from 'react-d3-tree';
// import './questionsTreeMap.css';

// const QuestionsTreeMap = () => {
//   const [questions, setQuestions] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch('http://rtp.dusky.bond:5000/api/displayQuestions');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setQuestions(data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         setError("Error fetching questions. Please try again later.");
//       }
//     };

//     fetchQuestions();
//   }, []);

//   const organizeQuestions = (questions) => {
//     const questionMap = {};
//     questions.forEach(question => {
//       questionMap[question._id] = { ...question, name: question.question, children: [] };
//     });

//     const buildTree = (questionId, visited = new Set()) => {
//       if (visited.has(questionId)) {
//         console.error("Cycle detected in question links. Question ID:", questionId);
//         return null;
//       }

//       visited.add(questionId);

//       const question = questionMap[questionId];
//       if (question.nextQuestion && questionMap[question.nextQuestion]) {
//         question.children.push(buildTree(question.nextQuestion, visited));
//       }
//       question.options?.forEach(option => {
//         if (option.optionsNextQuestion && questionMap[option.optionsNextQuestion]) {
//           question.children.push(buildTree(option.optionsNextQuestion, visited));
//         }
//       });

//       return question;
//     };

//     return questions.filter(question => !question.previousQuestion).map(question => buildTree(question._id));
//   };

//   const renderTreeMap = () => {
//     const root = {
//       name: 'Root',
//       children: organizeQuestions(questions),
//     };

//     if (!root || !root.children || root.children.length === 0) {
//       return <p>No Questions Available</p>;
//     }

//     return (
//       <div className="questions-tree-map-container">
//         <Tree data={root} orientation="vertical" pathFunc="step" translate={{ x: 300, y: 50 }} />
//       </div>
//     );
//   };

//   return (
//     <div className="questions-tree-container">
//       {error ? <p>{error}</p> : renderTreeMap()}
//     </div>
//   );
// };

// export default QuestionsTreeMap;
// ------------------------------------------------------------------------------------------------ The below code hasnt been tested out yet
import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import './questionsTreeMap.css';

const QuestionsTreeMap = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://rtp.dusky.bond:5000/api/displayQuestions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const organizeQuestions = (questions) => {
    const questionMap = {};
    questions.forEach(question => {
      questionMap[question._id] = { ...question, name: question.question, children: [] };
    });

    const buildTree = (questionId, visited = new Set()) => {
      if (visited.has(questionId)) {
        console.error("Cycle detected in question links. Question ID:", questionId);
        return null;
      }

      visited.add(questionId);

      const question = questionMap[questionId];
      if (question.nextQuestion && questionMap[question.nextQuestion]) {
        question.children.push(buildTree(question.nextQuestion, visited));
      }
      question.options?.forEach(option => {
        if (option.optionsNextQuestion && questionMap[option.optionsNextQuestion]) {
          question.children.push(buildTree(option.optionsNextQuestion, visited));
        }
      });

      return question;
    };

    return questions.filter(question => !question.previousQuestion).map(question => buildTree(question._id));
  };

  return (
    <div className="questions-tree-map-container">
      {questions.length > 0 ? (
        <Tree
          data={organizeQuestions(questions)}
          orientation="vertical"
          translate={{ x: 400, y: 50 }}
          nodeSize={{ x: 200, y: 200 }}
        />
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuestionsTreeMap;