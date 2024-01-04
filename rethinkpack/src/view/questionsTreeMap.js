import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import './questionsTreeMap.css';

const QuestionsTreeMap = () => {
    const [questions, setQuestions] = useState([]);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

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

    useEffect(() => {
        const handleResize = () => {
            const container = document.querySelector('.questions-tree-map-container');
            if (container) {
                const containerWidth = container.offsetWidth;
                setTranslate({ x: containerWidth / 2, y: 100 });
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const organizeQuestions = (questions) => {
        const questionMap = {};
        questions.forEach(question => {
            questionMap[question._id] = { ...question, name: question.question, children: [] };
        });
    
        const buildTree = (questionId, visited = new Set()) => {
            if (visited.has(questionId)) {
                console.error("Cycle detected in question links");
                return;
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

    const renderTreeMap = () => {
        const root = organizeQuestions(questions);
        const containerWidth = document.querySelector('.questions-tree-map-container').offsetWidth;
        const translate = { x: containerWidth / 2, y: 100 };

        if (!root || root.length === 0) {
            root = [{ name: "No Questions Available", children: [] }];
        }    

        return (
            <Tree data={root} orientation="vertical" translate={translate} />
        );
    };

    return (
        <div className="questions-tree-map-container">
            {questions.length > 0 ? renderTreeMap() : <p>Loading questions...</p>}
        </div>
    );
};

export default QuestionsTreeMap;