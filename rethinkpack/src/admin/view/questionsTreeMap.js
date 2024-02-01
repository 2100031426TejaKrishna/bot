import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

const destination = "localhost:5000";

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

  const fetchQuestionsRecursively = async (questionId) => {
    const questionData = await fetchQuestion(questionId);

    if (!questionData) {
      return null;
    }

    const childrenData = [];
    if (questionData.nextQuestion) {
      const childData = await fetchQuestionsRecursively(questionData.nextQuestion);
      if (childData) {
        childrenData.push(childData);
      }
    }

    return {
      name: questionData.question,
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