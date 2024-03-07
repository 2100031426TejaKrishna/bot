import React, { useState, useCallback, useEffect } from 'react';
import CreateQuestion from './admin/view/createQuestion';
import Questions from './admin/view/questions';
import QuestionsTreeMap from './admin/view/questionsTreeMap';
import CustomerQuestions from './customer/view/questions';
import UnlinkedQuestions from './admin/view/unlinkedQuestions';
import SubtitleQuestions from './admin/view/subtitleQuestions';
import NestedtitleQuestions from './admin/view/nestedtitleQuestions';
import TitleTab from './admin/view/titleTab';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

// Switch URLs between Server and Local hosting here
// const destination = "localhost:5000";
const destination = "rtp.dusky.bond:5000";

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [titles, setTitles] = useState([]); // State to hold titles
  const [activeSubTitle, setActiveSubTitle] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null); // State to hold selected subtitle
  const [activeNestedTitle, setActiveNestedTitle] = useState(null);
  const [selectedNestedtitle, setSelectedNestedtitle] = useState(null); // State to hold selected nested title


  const refreshQuestions = useCallback(() => {
    setTriggerRefresh(prev => !prev); 
  }, []);

  // Fetch titles when component mounts
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get(`http://${destination}/api/displayTitles`); // Assuming the endpoint is available at /api/displayAllTitles
        setTitles(response.data); // Set titles from the response
        console.log(response.data); // Log the titles data to the console
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };

    fetchTitles(); // Call the fetchTitles function
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

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
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'unlinked' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setActiveTab('unlinked')}
                >
                  Unlinked
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'title' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setActiveTab('title')}
                >
                  Title
                </a>
              </li>
              {/* Render <li> elements based on titles */}
              {titles.map((title, index) => (
                <li key={index} className="nav-item">
                  <a className={`nav-link ${activeTab === title.title.titleLabel ? 'active' : ''}`} 
                  href="#"
                  onClick={() => setActiveTab(title.title.titleLabel)}
                  >
                    {title.title.titleLabel.toString()}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Render subtitles below the current <ul> */}
            {activeTab !== 'list' && (
              <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
                {titles
                  .filter(title => title.title.titleLabel === activeTab)
                  .map((title, index) => (
                    title.title.subTitle.map((subTitle, subIndex) => (
                      <li key={subIndex} className="nav-item">
                        <a
                          className={`nav-link ${activeTab === subTitle.subTitleLabel ? 'active' : ''}`}
                          href="#"
                          onClick={() => {
                            setActiveTab(subTitle.subTitleLabel)
                            setActiveSubTitle(subTitle.subTitleLabel)
                            setSelectedSubtitle(subTitle._id.toString()); // Update selected subtitle
                            console.log('Selected Subtitle:', subTitle._id.toString()); // Log the selected subtitle ID
                          }}
                        >
                          {subTitle.subTitleLabel.toString()}
                        </a>
                      </li>
                    ))
                  ))}
              </ul>
            )}

            {/* Render nested titles below the current <ul> */}
            {activeTab !== 'list' && (
              <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
                {titles
                  .filter(title => title.title.subTitle.some(subTitle => subTitle.subTitleLabel === activeTab))
                  .map((title, index) => (
                    title.title.subTitle
                      .filter(subTitle => subTitle.subTitleLabel === activeTab)
                      .map((subTitle, subIndex) => (
                        subTitle.nestedTitle.map((nestedTitle, nestedIndex) => (
                          <li key={nestedIndex} className="nav-item">
                            <a
                              className={`nav-link ${activeTab === nestedTitle.nestedTitleLabel ? 'active' : ''}`}
                              href="#"
                              onClick={() => {
                                setActiveTab(nestedTitle.nestedTitleLabel)
                                setActiveNestedTitle(nestedTitle.nestedTitleLabel)
                                setSelectedNestedtitle(nestedTitle._id.toString()); // Update selected nestedtitle
                                console.log('Selected Nestedtitle:', nestedTitle._id.toString()); // Log the selected nestedtitle ID
                              }}
                            >
                              {nestedTitle.nestedTitleLabel.toString()}
                            </a>
                          </li>
                        ))
                      ))
                  ))}
              </ul>
            )}

            {/* Render appropriate content based on the active tab */}
            {activeTab === 'list' && <Questions triggerRefresh={triggerRefresh} />}
            {activeTab === 'treeMap' && <QuestionsTreeMap />}
            {activeTab === 'unlinked' && <UnlinkedQuestions />}
            {activeTab === 'title' && <TitleTab />}
            {activeTab === activeSubTitle && <SubtitleQuestions selectedSubtitle={selectedSubtitle} />}
            {activeTab === activeNestedTitle && <NestedtitleQuestions selectedNestedtitle={selectedNestedtitle} />}

          </div>
        } />

        <Route path="/customer" element={<CustomerQuestions triggerRefresh={triggerRefresh} />} />
      </Routes>
    </Router>
  );
}

export default App;
