import React, { useState, useEffect } from 'react';
import { Tree } from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';

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

  if (!data) {
    // Render loading state or placeholder while data is being fetched
    return <div>Loading...</div>;
  }

  const nodeStyles = {
    fill: '#ccc',
    stroke: '#333',
    strokeWidth: 1.5,
  };

  const linkStyles = {
    fill: 'none',
    stroke: '#333',
    strokeWidth: 1.5,
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Tree
        animated
        data={data}
        width={800}
        height={600}
        svgProps={{ style: { backgroundColor: 'lightgray', margin: 'auto' } }}
        gProps={{
          className: 'node',
          onClick: (node) => console.log(node),
          style: nodeStyles,
        }}
        linkProps={{ style: linkStyles }}
        orientation="vertical"
        duration={500}
        transitionDuration={500}
        textProps={{ x: 0, y: 15, style: { textAnchor: 'middle' } }}
        nodeOffset={50}
      />
    </div>
  );
};

export default QuestionsTreeMap;

// ----------------------------------------This is base line --------------------- --------------- --------------