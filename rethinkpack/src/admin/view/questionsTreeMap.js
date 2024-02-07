import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

const QuestionsTreeMap = () => {
  const [data, setData] = useState(null);

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
  if (questionData.optionType === 'dropdown' && questionData.options) {
    const dropdownOptions = questionData.options.map((option) => ({
      name: option.text,
    }));
    childrenData.push(...dropdownOptions);
  }

  if (questionData.nextQuestion) {
    console.log("Fetching question for nextQuestion:", questionData.nextQuestion);
    const childData = await fetchQuestionsRecursively(questionData.nextQuestion, visitedQuestions);
    if (childData) {
      childrenData.push(childData);
    }
  } else if (questionData.options && questionData.options.length > 0) {
    for (const option of questionData.options) {
      if (option.optionsNextQuestion) {
        console.log("Fetching question for optionsNextQuestion:", option.optionsNextQuestion);
        const childData = await fetchQuestionsRecursively(option.optionsNextQuestion, visitedQuestions);
        if (childData) {
          childrenData.push(childData);
        }
      }
    }
  }

  console.log("Processed question:", questionData);

  return {
    name: questionData.question,
    attributes: {
      optionType: questionData.optionType,
    },
    children: childrenData, // Include children in the result
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
    // Handle your logic here, e.g., fetch additional data for the clicked node
  };

  if (!data) {
    // Render loading state or placeholder while data is being fetched
    return <div>Loading...</div>;
  }

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const isDropdownOption = nodeDatum.attributes && nodeDatum.attributes.isDropdownOption;

    return (
      <div onClick={isDropdownOption ? null : () => toggleNode()}>
        {nodeDatum.name}
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