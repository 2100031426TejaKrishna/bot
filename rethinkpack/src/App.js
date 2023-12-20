import React, { useState, useCallback } from 'react';
import CreateQuestion from './view/createQuestion';
import Questions from './view/questions';

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const refreshQuestions = useCallback(() => {
    setTriggerRefresh(prev => !prev); 
  }, []);

  return (
    <div className="App">
      <CreateQuestion onQuestionCreated={refreshQuestions} />
      <Questions triggerRefresh={triggerRefresh} />
      {/* other components */}
    </div>
  );
}

export default App;