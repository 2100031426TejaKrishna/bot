import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import CustomerLogin from './components/CustomerLogin';
//import Responses from './customer/view/responses';
import CreateQuestion from './admin/view/createQuestion';
import Questions from './admin/view/questions';
import QuestionsTreeMap from './admin/view/questionsTreeMap';
import CustomerQuestions from './customer/view/questions';
import UnlinkedQuestions from './admin/view/unlinkedQuestions';
import SubtitleQuestions from './admin/view/subtitleQuestions';
import NestedtitleQuestions from './admin/view/nestedtitleQuestions';
import TitleTab from './admin/view/titleTab';

const destination = "localhost:5000";
// const destination = "rtp.dusky.bond:5000";

const AppContent = () => {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [titleTab, setTitleTab] = useState('');
  const [subtitleTab, setSubTitleTab] = useState('');
  const [nestedtitleTab, setNestedTitleTab] = useState('');
  const [titles, setTitles] = useState([]);
  const [activeSubTitle, setActiveSubTitle] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [activeNestedTitle, setActiveNestedTitle] = useState(null);
  const [selectedNestedtitle, setSelectedNestedtitle] = useState(null);

  const navigate = useNavigate();

  const refreshQuestions = useCallback(() => {
    setTriggerRefresh(prev => !prev); 
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch(`http://${destination}/api/displayTitles`);
        if (response.ok) {
          const data = await response.json();
          setTitles(data);
          console.log('Fetched titles:', data);
        }
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };
    fetchTitles();
  }, [destination]);

  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer" element={
          <PrivateRoute redirectPath="/customer-login">
            <CustomerQuestions triggerRefresh={triggerRefresh} />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute redirectPath="/admin-login">
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
                {titles.map((title, index) => (
                  <li key={index} className="nav-item">
                    <a className={`nav-link ${activeTab === title?.title?.titleLabel ? 'active' : ''}`} 
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
              {activeTab !== 'list' && (
                <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
                  {titles
                    .filter(title => title?.title?.titleLabel === activeTab)
                    .map((title, index) => (
                      title.title.subTitle.map((subTitle, subIndex) => (
                        <li key={subIndex} className="nav-item">
                          <a
                            className={`nav-link ${activeTab === subTitle?.subTitleLabel ? 'active' : ''}`}
                            href="#"
                            onClick={() => {
                              if (subTitle?.subTitleLabel) {
                                setSubTitleTab(subTitle.subTitleLabel);
                                setActiveTab(subTitle.subTitleLabel);
                                setActiveSubTitle(subTitle.subTitleLabel);
                                setSelectedSubtitle(subTitle._id?.toString() || 'Undefined subtitle ID');
                                document.getElementById('btBackSub').style.display = 'inline';
                                document.getElementById('btBackNested').style.display = 'none';
                                console.log('Selected Subtitle:', subTitle._id?.toString());
                              } else {
                                console.error('Undefined subTitle or subTitleLabel:', subTitle);
                              }
                            }}
                          >
                            {subTitle?.subTitleLabel?.toString() || 'Undefined subtitle'}
                          </a>
                        </li>
                      ))
                    ))}
                </ul>
              )}
              {activeTab !== 'list' && (
                <ul className="nav nav-tabs" style={{ paddingLeft: '80px' }}>
                  {activeTab !== 'list' && (
                    <a 
                      className='nav-link'
                      href='#'
                      id='btBackSub' 
                      style={{ display: 'none' }} 
                      onClick={() =>{
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
                                className={`nav-link ${activeTab === nestedTitle?.nestedTitleLabel ? 'active' : ''}`}
                                href="#"
                                onClick={() => {
                                  if (nestedTitle?.nestedTitleLabel) {
                                    setNestedTitleTab(nestedTitle.nestedTitleLabel);
                                    setActiveTab(nestedTitle.nestedTitleLabel);
                                    setActiveNestedTitle(nestedTitle.nestedTitleLabel);
                                    setSelectedNestedtitle(nestedTitle._id?.toString() || 'Undefined nested title ID');
                                    document.getElementById('btBackSub').style.display = 'none';
                                    document.getElementById('btBackNested').style.display = 'inline';
                                    console.log('Selected Nestedtitle:', nestedTitle._id?.toString());
                                  } else {
                                    console.error('Undefined nestedTitle or nestedTitleLabel:', nestedTitle);
                                  }
                                }}
                              >
                                {nestedTitle?.nestedTitleLabel?.toString() || 'Undefined nested title'}
                              </a>
                            </li>
                          ))
                        ))
                    ))}
                </ul>
              )}
              {activeTab === 'list' && <Questions triggerRefresh={triggerRefresh} />}
              {activeTab === 'treeMap' && <QuestionsTreeMap />}
              {activeTab === 'unlinked' && <UnlinkedQuestions />}
              {activeTab === 'title' && <TitleTab />}
              {activeTab === activeSubTitle && <SubtitleQuestions selectedSubtitle={selectedSubtitle} />}
              {activeTab === activeNestedTitle && <NestedtitleQuestions selectedNestedtitle={selectedNestedtitle} />}
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
