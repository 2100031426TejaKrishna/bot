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
  const [titleTab, setTitleTab] = useState('');
  const [subtitleTab, setSubTitleTab] = useState('');
  const [nestedtitleTab, setNestedTitleTab] = useState('');
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
                    onClick={() => {
                      setActiveTab(title.title.titleLabel)
                      setTitleTab(title.title.titleLabel);
                    }} 
                  >
                    {title.title.titleLabel.toString()}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Render subtitles below the current <ul> */}
            {activeTab !== 'list' && (
              <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
                {/* {activeTab !== 'list' && (
                  <a 
                    className='nav-link' 
                    href='#'
                    id='btBackList' 
                    style={{ display: 'inline' }} 
                    onClick={() => setActiveTab('list')}
                    >Home
                  </a>
                )} */}
                {titles
                  .filter(title => title.title.titleLabel === activeTab)
                  .map((title, index) => (
                    title.title.subTitle.map((subTitle, subIndex) => (
                      <li key={subIndex} className="nav-item">
                        <a
                          className={`nav-link ${activeTab === subTitle.subTitleLabel ? 'active' : ''}`}
                          href="#"
                          onClick={() => {
                            setSubTitleTab(subTitle.subTitleLabel);
                            setActiveTab(subTitle.subTitleLabel)
                            setActiveSubTitle(subTitle.subTitleLabel)
                            setSelectedSubtitle(subTitle._id.toString()); // Update selected subtitle
                            // document.getElementById('btBackList').style.display = 'none';
                            document.getElementById('btBackSub').style.display = 'inline';
                            document.getElementById('btBackNested').style.display = 'none';
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
                {activeTab !== 'list' && (
                  <a 
                    className='nav-link'
                    href='#'
                    id='btBackSub' 
                    style={{ display: 'none' }} 
                    onClick={() =>{
                      // document.getElementById('btBackList').style.display = 'inline';
                      document.getElementById('btBackSub').style.display = 'none';
                      document.getElementById('btBackNested').style.display = 'none';
                      setActiveTab(titleTab)
                      
                    }} 
                  >Back</a>
                    
                )}
                {activeTab !== 'list' && (
                  <a 
                    className='nav-link'
                    href='#'
                    id='btBackNested' 
                    style={{ display: 'none' }} 
                    onClick={() =>{
                      setActiveTab(subtitleTab)
                      // document.getElementById('btBackList').style.display = 'none';

  
                      document.getElementById('btBackSub').style.display = 'inline';
                      document.getElementById('btBackNested').style.display = 'none';
                    }} 
                  >Back</a>
                    
                )}
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
                                setNestedTitleTab(nestedTitle.nestedTitleLabel);
                                setActiveTab(nestedTitle.nestedTitleLabel)
                                setActiveNestedTitle(nestedTitle.nestedTitleLabel)
                                setSelectedNestedtitle(nestedTitle._id.toString()); // Update selected nestedtitle
                                document.getElementById('btBackSub').style.display = 'none';
                                // document.getElementById('btBackList').style.display = 'none';
                                document.getElementById('btBackNested').style.display = 'inline';
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
