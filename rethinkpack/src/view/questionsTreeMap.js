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
// import React, { useEffect, useState } from 'react';
// import Tree from 'react-d3-tree';
// import './questionsTreeMap.css';

// const QuestionsTreeMap = () => {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/displayQuestions');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setQuestions(data);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
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

//   return (
//     <div className="questions-tree-map-container">
//       {questions.length > 0 ? (
//         <Tree
//           data={organizeQuestions(questions)}
//           orientation="vertical"
//           translate={{ x: 400, y: 50 }}
//           nodeSize={{ x: 200, y: 200 }}
//         />
//       ) : (
//         <p>Loading questions...</p>
//       )}
//     </div>
//   );
// };

// export default QuestionsTreeMap;
// -----------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const QuestionsTreeMap = () => {
//   const [questionData, setQuestionData] = useState([]);

//   useEffect(() => {
//     // Fetch data from Node.js server
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/displayQuestions');
//         setQuestionData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array ensures the effect runs once on component mount

//   return (
//     <div>
//       <h2>Survey Questions TreeMap</h2>
//       {questionData.length > 0 && (
//         <div>
//           <h3>Question Types</h3>
//           <ul>
//             {questionData.map((type) => (
//               <li key={type.questionType}>
//                 <strong>{type.questionType}</strong>
//                 <ul>
//                   {type.questions.map((question) => (
//                     <li key={question.questionText}>
//                       {question.questionText} - Size: {question.size}
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestionsTreeMap;
// -------------------------------------------------------------------------------------------------------
// import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
// import { Tree } from 'react-tree-graph';
// import 'react-tree-graph/dist/style.css';
// import rootNode from '/home/username/Desktop/Git/Assessment-tool/rethinkpack/src/database/database.js';

// const DEFAULT_DEPTH = 9;

// const cloneWithDepth = (object, depth = DEFAULT_DEPTH) => {
//   if (depth === -1) return undefined;
//   if (typeof object !== 'object') return object;

//   if (Array.isArray(object)) {
//     return object
//       .map((val) => cloneWithDepth(val, depth - 1))
//       .filter((val) => val !== undefined);
//   }

//   const clone = {};
//   for (const key in object) {
//     if (typeof object[key] === 'object' && depth - 1 === -1) {
//       continue;
//     }
//     const clonedValue = cloneWithDepth(object[key], depth - 1);
//     if (clonedValue !== undefined) {
//       clone[key] = clonedValue;
//     }
//   }
//   return clone;
// };

// const findNode = (key, node = rootNode, parentPath = []) => {
//   const path = [...parentPath, node.name];
//   if (node.name === key) {
//     return { node: cloneWithDepth(node), path };
//   }

//   if (Array.isArray(node.children)) {
//     for (const child of node.children) {
//       const found = findNode(key, child, path);
//       if (found) return found;
//     }
//   }
// };

// const useWindowInnerSize = () => {
//   const [innerWidth, setInnerWidth] = useState(window.innerWidth);
//   const [innerHeight, setInnerHeight] = useState(window.innerHeight);

//   const handleResize = useCallback(() => {
//     setInnerWidth(window.innerWidth);
//     setInnerHeight(window.innerHeight);
//   }, []);

//   useEffect(() => {
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [handleResize]);

//   return { innerWidth, innerHeight };
// };

// const QuestionsTreeMap = () => {
//   const [data, setData] = useState(cloneWithDepth(rootNode));
//   const [path, setPath] = useState([rootNode.name]);
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);
//   const { innerWidth, innerHeight } = useWindowInnerSize();
//   const canvasWrapper = useRef(null);

//   const setCanvasSize = useCallback(() => {
//     const { clientWidth, clientHeight } = canvasWrapper.current;
//     setCanvasWidth(clientWidth);
//     setCanvasHeight(clientHeight);
//   }, []);

//   useEffect(setCanvasSize, [setCanvasSize]);

//   useLayoutEffect(() => {
//     setCanvasWidth(0);
//     setCanvasHeight(0);
//   }, [innerWidth, innerHeight]);

//   useEffect(() => () => {
//     let isMounted = true;
//     requestAnimationFrame(() => isMounted && setCanvasSize());
//     return () => isMounted = false;
//   }, [innerWidth, innerHeight, setCanvasSize]);

//   const changeNode = ({ node, path }) => {
//     setPath(path);
//     setData(node);
//   };

//   const handleClick = (_, key) => {
//     changeNode(findNode(key));
//   };

//   return (
//     <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//       <div>
//         <div>
//           {path.map((p) => (
//             <button
//               style={{
//                 margin: '0',
//                 border: 'none',
//                 outline: 'none',
//                 background: 'none',
//                 padding: '0 0.1rem',
//                 textDecoration: 'underline',
//                 cursor: data.name === p ? '' : 'pointer',
//                 color: data.name === p ? 'black' : 'blue',
//               }}
//               key={p}
//               onClick={() => changeNode(findNode(p))}
//             >
//               {p}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div style={{ flexGrow: 1 }} ref={canvasWrapper}>
//         <Tree
//           animated
//           data={data}
//           width={canvasWidth}
//           height={canvasHeight}
//           nodeRadius={15}
//           svgProps={{ style: { backgroundColor: 'lightgray' } }}
//           gProps={{ className: 'node', onClick: handleClick }}
//           margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default QuestionsTreeMap;

// ----------------------------------------------------------------------------------------
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Tree } from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';

// Import the function to fetch data from MongoDB
import { fetchDataFromMongoDB } from '/home/username/Desktop/Git/Assessment-tool/rethinkpack/src/database/mongodb-utils.js';  // Replace with the actual path

// Add the useWindowInnerSize function
const useWindowInnerSize = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const handleResize = useCallback(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return { innerWidth, innerHeight };
};

const DEFAULT_DEPTH = 9;

const cloneWithDepth = (object, depth = DEFAULT_DEPTH) => {
  if (depth === -1) return undefined;
  if (typeof object !== 'object') return object;

  if (Array.isArray(object)) {
    return object
      .map((val) => cloneWithDepth(val, depth - 1))
      .filter((val) => val !== undefined);
  }

  const clone = {};
  for (const key in object) {
    if (typeof object[key] === 'object' && depth - 1 === -1) {
      continue;
    }
    const clonedValue = cloneWithDepth(object[key], depth - 1);
    if (clonedValue !== undefined) {
      clone[key] = clonedValue;
    }
  }
  return clone;
};

const findNode = async (key, parentPath = []) => {
  try {
    // Fetch data from MongoDB using your utility function
    const rootNode = await fetchDataFromMongoDB();  // Adjust this according to your MongoDB fetching logic

    const path = [...parentPath, rootNode.name];
    if (rootNode.name === key) {
      return { node: cloneWithDepth(rootNode), path };
    }

    if (Array.isArray(rootNode.children)) {
      for (const child of rootNode.children) {
        const found = await findNode(key, path);
        if (found) return found;
      }
    }
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    // Handle the error appropriately
  }
};

const QuestionsTreeMap = () => {
  const [data, setData] = useState(null);
  const [path, setPath] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const { innerWidth, innerHeight } = useWindowInnerSize();
  const canvasWrapper = useRef(null);

  const setCanvasSize = useCallback(() => {
    // Check if canvasWrapper.current is not null before destructure
    if (canvasWrapper.current) {
      const { clientWidth, clientHeight } = canvasWrapper.current;
      setCanvasWidth(clientWidth);
      setCanvasHeight(clientHeight);
    }
  }, []);

  useEffect(setCanvasSize, [setCanvasSize]);

  useLayoutEffect(() => {
    setCanvasWidth(0);
    setCanvasHeight(0);
  }, [innerWidth, innerHeight]);

  useEffect(() => {
    let isMounted = true;
    // Fetch data when the component mounts
    findNode('65aa3275ab9a2e87b4dbd098')
      .then(({ node, path }) => {
        isMounted && setPath(path) && setData(node);
        console.log('Fetched data:', node);
      })
      .catch(error => console.error('Error setting initial data:', error));
  
    return () => (isMounted = false);
  }, []); // Empty dependency array means it runs once when mounted

  const changeNode = async ({ node, path }) => {
    try {
      // Fetch data when changing node
      const newData = await findNode('_id: 658538a6ce58d563c955907f');
      setPath(newData.path);
      setData(newData.node);
    } catch (error) {
      console.error('Error changing node:', error);
      // Handle the error appropriately
    }
  };

  const handleClick = (_, key) => {
    changeNode(findNode(key));
  };

  if (!data) {
    // Render loading state or placeholder while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <div>
        <div>
          {path.map((p) => (
            <button
              style={{
                margin: '0',
                border: 'none',
                outline: 'none',
                background: 'none',
                padding: '0 0.1rem',
                textDecoration: 'underline',
                cursor: data.name === p ? '' : 'pointer',
                color: data.name === p ? 'black' : 'blue',
              }}
              key={p}
              onClick={() => changeNode(findNode(p))}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flexGrow: 1 }} ref={canvasWrapper}>
        <Tree
          animated
          data={data}
          width={canvasWidth}
          height={canvasHeight}
          nodeRadius={15}
          svgProps={{ style: { backgroundColor: 'lightgray' } }}
          gProps={{ className: 'node', onClick: handleClick }}
          margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
        />
      </div>
    </div>
  );
            }
export default QuestionsTreeMap;