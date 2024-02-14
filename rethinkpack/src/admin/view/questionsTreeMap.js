import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

const QuestionsTreeMap = () => {
  const [data, setData] = useState(null);

  const fetchOptionText = async (optionId) => {
    try {
      const response = await fetch(`http://${destination}/api/optionText/${optionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const optionTextData = await response.json();
      console.log("Option text response:", optionTextData); // Log the entire response
      console.log("Found option text:", optionTextData.texts);
      return optionTextData.texts;
    } catch (error) {
      console.error("Error fetching option text:", error);
    }
  };

  const fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://${destination}/api/nextQuestion/${questionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const questionData = await response.json();
      return questionData;
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

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

    // Check if optionType is dropdown and send options to frontend
    if (['dropdown', 'multipleChoice', 'checkboxGrid', 'linear', 'multipleChoiceGrid'].includes(questionData.optionType) && questionData.options) {
      const optionTexts = await Promise.all(questionData.options.map(option => fetchOptionText(option._id)));
      const mergedText = optionTexts.join(', ');

      console.log("Merged option texts:", mergedText);

      if (questionData.optionsNextQuestion) {
        console.log("Fetching question for optionsNextQuestion:", questionData.optionsNextQuestion);
        const childData = await fetchQuestionsRecursively(questionData.optionsNextQuestion, visitedQuestions);
        if (childData) {
          childrenData.push(childData);
        }
      }

      childrenData.push({
        name: `${questionData.question} - ${mergedText}`,
        attributes: {
          text: mergedText,
        },
      });
    }

    if (questionData.nextQuestion) {
      console.log("Fetching question for nextQuestion:", questionData.nextQuestion);
      const childData = await fetchQuestionsRecursively(questionData.nextQuestion, visitedQuestions);
      if (childData) {
        childrenData.push(childData);
      }
    }

    console.log("Processed question:", questionData);

    return {
      name: questionData.question,
      attributes: {
        text: questionData.text || "", // Include the text property for the main question
      },
      children: childrenData,
    };
  };

  const fetchQuestions = async () => {
    try {
      const firstResponse = await fetch(`http://${destination}/api/firstQuestion`);
      if (!firstResponse.ok) {
        throw new Error(`HTTP error! status: ${firstResponse.status}`);
      }
      const firstQuestionData = await firstResponse.json();

      const treeData = await fetchQuestionsRecursively(firstQuestionData._id);

      console.log("Fetched tree data:", treeData);

      setData(treeData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []); // This will run only once on component mount

  const handleNodeClick = (nodeData) => {
    console.log('Node Clicked:', nodeData);
    // Handle your logic here, e.g., display the fetched option text
    if (nodeData.attributes && nodeData.attributes.text) {
      console.log('Option Text:', nodeData.attributes.text);
    }
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    console.log("Rendering node:", nodeDatum);

    return (
      <div onClick={() => toggleNode()}>
        {/* Render question text */}
        <div>{nodeDatum.attributes && nodeDatum.attributes.text || nodeDatum.name}</div>

        {/* Render option values below the question */}
        {nodeDatum.children && (
          <div style={{ marginLeft: '20px' }}>
            {nodeDatum.children.map((child) => (
              <div key={child.name}>{child.attributes.text}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!data) {
    // Render loading state or placeholder while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 400, y: 50 }}
        onClick={handleNodeClick}
        renderCustomNode={renderCustomNode}
      />
    </div>
  );
};

export default QuestionsTreeMap;