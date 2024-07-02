import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import './questionsTreeMap.css';

const destination = "localhost:5000";

const QuestionsTreeMap = () => {
  const [data, setData] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('png');
  const treeContainerRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      console.log("Fetching all questions...");
      const response = await fetch(`http://${destination}/api/displayQuestions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const questionsData = await response.json();
      console.log(`Fetched questions data: ${JSON.stringify(questionsData)}`);
      const treeData = buildTreeStructure(questionsData);
      console.log(`Tree data: ${JSON.stringify(treeData)}`);
      setData(treeData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const buildTreeStructure = (questionsData) => {
    const questionMap = new Map();
    questionsData.forEach(question => {
      questionMap.set(question._id, question);
    });

    const visited = new Set();

    const buildNode = (questionId, connectionType = null) => {
      if (visited.has(questionId)) return null;
      visited.add(questionId);

      const question = questionMap.get(questionId);
      if (!question) return null;

      const node = {
        name: question.question,
        attributes: {
          text: question.text,
          connectionType,
        },
        children: [],
      };

      if (question.options) {
        question.options.forEach(option => {
          const optionNode = {
            name: option.text,
            attributes: {
              connectionType: 'option',
            },
            children: [],
          };
          if (option.optionsNextQuestion) {
            const optionNextQuestionNode = buildNode(option.optionsNextQuestion, 'option');
            if (optionNextQuestionNode) {
              optionNode.children.push(optionNextQuestionNode);
            }
          }
          node.children.push(optionNode);
        });
      }

      if (question.nextQuestion) {
        const nextQuestionNode = buildNode(question.nextQuestion, 'nextQuestion');
        if (nextQuestionNode) {
          node.children.push(nextQuestionNode);
        }
      }

      return node;
    };
    
    const treeData = [];
    questionsData.forEach(question => {
      if (!question.previousQuestion) {
        const rootNode = buildNode(question._id);
        if (rootNode) {
          treeData.push(rootNode);
        }
      }
    });

    questionsData.forEach(question => {
      if (!visited.has(question._id)) {
        const unconnectedNode = buildNode(question._id);
        if (unconnectedNode) {
          treeData.push(unconnectedNode);
        }
      }
    });

    return treeData;
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNodeClick = (nodeData) => {
    console.log('Node Clicked:', nodeData);
    if (nodeData.attributes && nodeData.attributes.text) {
      console.log('Option Text:', nodeData.attributes.text);
    }
  };

  const CustomLink = ({ linkData }) => {
    const { source, target } = linkData;
    const color = target.data.attributes.connectionType === 'nextQuestion' ? 'red' : 'green';
    return (
      <path
        d={`M${source.x},${source.y}C${source.x},${(source.y + target.y) / 2} ${target.x},${(source.y + target.y) / 2} ${target.x},${target.y}`}
        style={{ fill: 'none', stroke: color, strokeWidth: 2 }}
      />
    );
  };

  const downloadTree = async () => {
    if (!treeContainerRef.current) return;
    const element = treeContainerRef.current;
    try {
      let dataUrl;
      switch (downloadFormat) {
        case 'png':
          dataUrl = await toPng(element);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(element, { quality: 0.95 });
          break;
        case 'svg':
          dataUrl = await toSvg(element);
          break;
        case 'pdf':
          dataUrl = await toPng(element);
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
          pdf.save('tree.pdf');
          return;
        default:
          return;
      }
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `tree.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating download:', error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="controls">
        <select className='dropdown' value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="svg">SVG</option>
          <option value="pdf">PDF</option>
        </select>
        <button className='download-button' onClick={downloadTree}>Download Tree</button>
      </div>
      <div ref={treeContainerRef} className="tree-container mt4">
        <Tree
          data={data}
          orientation="vertical"
          pathFunc="straight"
          separation={{ siblings: 2, nonSiblings: 2 }}
          collapsible={false}
          transitionDuration={0}
          linkComponent={CustomLink}
          onClick={handleNodeClick}
          nodeSize={{ x: 200, y: 100 }}
        />
      </div>
    </div>
  );
};

export default QuestionsTreeMap;
