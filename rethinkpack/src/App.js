import React, { useState, useCallback } from 'react';
import CreateQuestion from './view/createQuestion';
import Questions from './view/questions';
import QuestionsTreeMap from './view/questionsTreeMap';

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const refreshQuestions = useCallback(() => {
    setTriggerRefresh(prev => !prev); 
  }, []);

  return (
    <div className="App">
      <CreateQuestion onQuestionCreated={refreshQuestions} onQuestionDeleted={refreshQuestions} triggerRefresh={triggerRefresh} />
      <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
        <li className="nav-item">
          <a 
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} 
            href="#" 
            onClick={() => setActiveTab('list')}
          >
            All Questions
          </a>
        </li>
        <li className="nav-item">
          <a 
            className={`nav-link ${activeTab === 'treeMap' ? 'active' : ''}`} 
            href="#" 
            onClick={() => setActiveTab('treeMap')}
          >
            Tree Map
          </a>
        </li>
      </ul>
      {activeTab === 'list' && <Questions triggerRefresh={triggerRefresh} />}
      {activeTab === 'treeMap' && <QuestionsTreeMap />}
      {/* other components */}
    </div>
  );
}

export default App;