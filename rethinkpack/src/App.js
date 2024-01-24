import React, { useState, useCallback } from 'react';
import CreateQuestion from './admin/view/createQuestion';
import Questions from './admin/view/questions';
import QuestionsTreeMap from './admin/view/questionsTreeMap';
import CustomerQuestions from './customer/view/questions';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const refreshQuestions = useCallback(() => {
    setTriggerRefresh(prev => !prev); 
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
          </div>
        } />

        <Route path="/customer" element={<CustomerQuestions triggerRefresh={triggerRefresh} />} />
      </Routes>
    </Router>
  );
}

export default App;