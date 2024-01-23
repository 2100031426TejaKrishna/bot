// import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
// import { Tree } from 'react-tree-graph';
// import 'react-tree-graph/dist/style.css';

// import { fetchDataFromMongoDB } from '/home/username/Desktop/Git/Assessment-tool/rethinkpack/src/database/mongodb-utils.js';
// const destination = "localhost:5000";

// // Add the useWindowInnerSize function
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

// // const findNode = async (key, parentPath = []) => {
// //   try {
// //     // Fetch data from MongoDB using your utility function
// //     const rootNode = await fetchDataFromMongoDB();  // Adjust this according to your MongoDB fetching logic

// //     const path = [...parentPath, rootNode.name];
// //     if (rootNode.name === key) {
// //       return { node: cloneWithDepth(rootNode), path };
// //     }

// //     if (Array.isArray(rootNode.children)) {
// //       for (const child of rootNode.children) {
// //         const found = await findNode(key, path);
// //         if (found) return found;
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Error fetching data from MongoDB:', error);
// //     // Handle the error appropriately
// //   }
// // };

// const QuestionsTreeMap = () => {
//   const [data, setData] = useState(null);
//   const [path, setPath] = useState([]);
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);
//   const { innerWidth, innerHeight } = useWindowInnerSize();
//   const canvasWrapper = useRef(null);
//   const [questions, setQuestions] = useState([]);
//   const [rootQuestion, setRootQuestion] = useState(null);

//   const setCanvasSize = useCallback(() => {
//     // Check if canvasWrapper.current is not null before destructure
//     if (canvasWrapper.current) {
//       const { clientWidth, clientHeight } = canvasWrapper.current;
//       setCanvasWidth(clientWidth);
//       setCanvasHeight(clientHeight);
//     }
//   }, []);

//   useEffect(setCanvasSize, [setCanvasSize]);

//   useLayoutEffect(() => {
//     setCanvasWidth(0);
//     setCanvasHeight(0);
//   }, [innerWidth, innerHeight]);

//   useEffect(() => {
//     const fetchRootQuestion = async () => {
//       try {
//         const response = await fetch(`http://${destination}/api/findRootQuestion`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
        
//         // Set state or perform other actions based on fetchedData
//         setRootQuestion(data); // Assuming you have a state variable to store the root question
//       } catch (error) {
//         console.error("Error fetching root question:", error);
//       }
//     };
  
//     fetchRootQuestion();
//   }, []);

//   const findNode = async (key, parentPath = []) => {
//     try {
//       const path = [...parentPath, key];
//       const rootNode = questions.find(question => question.name === key);

//       if (rootNode) {
//         return { node: cloneWithDepth(rootNode), path };
//       }

//       const childrenNodes = questions.reduce((acc, question) => {
//         if (Array.isArray(question.children) && question.children.includes(key)) {
//           acc.push(question);
//         }
//         return acc;
//       }, []);

//       for (const child of childrenNodes) {
//         const found = await findNode(child.name, path);
//         if (found) return found;
//       }
//     } catch (error) {
//       console.error('Error fetching data from MongoDB:', error);
//     }
//   };

//   const changeNode = async ({ node, path }) => {
//     try {
//       // Fetch data when changing node
//       const newData = await findNode('_id: 658538a6ce58d563c955907f');
//       setPath(newData.path);
//       setData(newData.node);
//     } catch (error) {
//       console.error('Error changing node:', error);
//       // Handle the error appropriately
//     }
//   };

//   const handleClick = (_, key) => {
//     changeNode(findNode(key));
//   };


//   if (!data) {
//     // Render loading state or placeholder while data is being fetched
//     return <div>Loading...</div>;
//   }

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
//             }
// export default QuestionsTreeMap;