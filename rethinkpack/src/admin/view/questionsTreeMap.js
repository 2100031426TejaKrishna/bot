import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

const QuestionsTreeMap = () => {
  const [data, setData] = useState(null);

  // Function to fetch option text
  const fetchOptionText = async (optionId) => {
    try {
      const response = await fetch(`http://${destination}/api/optionText/${optionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const optionTextData = await response.json();
      return optionTextData.texts;
    } catch (error) {
      console.error("Error fetching option text:", error);
    }
  };

  // Function to fetch a question by ID
  const fetchQuestion = async (questionId) => {
    try {
      if (questionId === undefined) {
        console.error('Error: questionId is undefined');
        return null;
      }

      const response = await fetch(`http://${destination}/api/nextQuestion/${questionId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const questionData = await response.json();
      return questionData;
    } catch (error) {
      console.error("Error fetching question:", error);
      return null;
    }
  };

  // Recursive function to fetch questions and build tree structure
  const fetchQuestionsRecursively = async (questionId, visitedQuestions = new Set()) => {
    if (visitedQuestions.has(questionId)) {
      console.log("Already visited question:", questionId);
      return null;
    }

    visitedQuestions.add(questionId);
    const questionData = await fetchQuestion(questionId);

    if (!questionData) {
      return null;
    }

    const childrenData = [];

    if (questionData.optionType === 'checkboxGrid') {
      // Handle checkboxGrid type
      const rowTexts = questionData.grid.rows.map(row => row.text);
      const columnTexts = questionData.grid.columns.map(column => column.text);
      const mergedTexts = [...rowTexts, ...columnTexts].join(',');

      const checkboxGridNode = {
        name: questionData.question,
        attributes: {
          text: mergedTexts,
        },
      };

      if (questionData.nextQuestion) {
        const childData = await fetchQuestionsRecursively(questionData.nextQuestion, visitedQuestions);
        checkboxGridNode.children = Array.isArray(childData) && childData.length > 0 ? childData : [];
      }

      childrenData.push(checkboxGridNode);
    } else if (['dropdown', 'multipleChoice', 'linear', 'multipleChoiceGrid'].includes(questionData.optionType) && questionData.options) {
      // Handle dropdown, multipleChoice, linear, multipleChoiceGrid types
      const optionTexts = await Promise.all(questionData.options.map(option =>
        fetchOptionText(option._id).catch(error => {
          console.error(`Error fetching option text for option ${option._id}:`, error);
          return ''; // Provide a default value or handle the error as needed
        })
      ));

      const mergedText = optionTexts.join(',');

      const mainQuestionNode = {
        name: questionData.question,
        attributes: {
          text: mergedText,
        },
        children: [],
      };

      if (Array.isArray(questionData.options)) {
        try {
          const optionsNextQuestionArray = questionData.options;

          for (const option of optionsNextQuestionArray) {
            if (option.optionsNextQuestion) {
              const optionsNextQuestionData = await fetchQuestionsRecursively(option.optionsNextQuestion, visitedQuestions);

              if (optionsNextQuestionData && optionsNextQuestionData.length > 0) {
                mainQuestionNode.children = [...mainQuestionNode.children, ...optionsNextQuestionData];

                for (const child of optionsNextQuestionData) {
                  if (child.optionsNextQuestion) {
                    const nestedChildData = await fetchQuestionsRecursively(child.optionsNextQuestion, visitedQuestions);
                    if (nestedChildData && nestedChildData.length > 0) {
                      child.children = [...child.children, ...nestedChildData];
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error fetching optionsNextQuestion:", error);
        }
      }

      if (questionData.nextQuestion) {
        const nextQuestionData = await fetchQuestionsRecursively(questionData.nextQuestion, visitedQuestions);
        mainQuestionNode.children.push(...nextQuestionData);
      }

      childrenData.push(mainQuestionNode);
    } else {
      // Handle regular node
      const node = {
        name: questionData.question,
        attributes: {
          text: questionData.text || "",
        },
      };

      if (questionData.nextQuestion) {
        const nextQuestionData = await fetchQuestionsRecursively(questionData.nextQuestion, visitedQuestions);
        node.children = nextQuestionData;
      }

      childrenData.push(node);
    }
    return childrenData;
  };

  // Function to fetch initial questions and set data state
  const fetchQuestions = async () => {
    try {
      const firstResponse = await fetch(`http://${destination}/api/firstQuestion`);
      if (!firstResponse.ok) {
        throw new Error(`HTTP error! status: ${firstResponse.status}`);
      }
      const firstQuestionData = await firstResponse.json();
      const treeData = await fetchQuestionsRecursively(firstQuestionData._id);
      setData(treeData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Function to handle node click
  const handleNodeClick = (nodeData) => {
    console.log('Node Clicked:', nodeData);
    if (nodeData.attributes && nodeData.attributes.text) {
      console.log('Option Text:', nodeData.attributes.text);
    }
  };

  // Render loading message if data is not available
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 400, y: 50 }}
        onClick={handleNodeClick}
      />
    </div>
  );
};

export default QuestionsTreeMap;