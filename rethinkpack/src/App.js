import React from 'react';
import CreateQuestion from './view/createQuestion';
import Questions from './view/questions';

function App() {
  return (
    <div className="App">
      <CreateQuestion />
      <Questions />
      {/* other components */}
    </div>
  );
}

export default App;