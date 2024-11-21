import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Responses from './admin/view/userResponseMarks';
import CustomerLogin from './components/CustomerLogin';
import CreateQuestion from './admin/view/createQuestion';
import Questions from './admin/view/questions';
import QuestionsTreeMap from './admin/view/questionsTreeMap';
import CustomerQuestions from './customer/view/questions';
import UnlinkedQuestions from './admin/view/unlinkedQuestions';
import SubtitleQuestions from './admin/view/subtitleQuestions';
import NestedtitleQuestions from './admin/view/nestedtitleQuestions';
import TitleTab from './admin/view/titleTab';
import DetailsTab from './admin/view/DetailsTab'; 
import CustomerDashboard from './customer/view/CustomerDashboard'; // Import the new CustomerDashboard component
import Profile from './customer/view/Profile'; // Import the new CustomerDashboard component
import EditProfile from './customer/view/EditProfile';
import Subscribe from './customer/view/SubscribePage';
import Contact from './customer/view/ContactUs';


const destination = "localhost:5000"; // Ensure this matches your server configuration

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
        const response = await fetch(`http://${destination}/api/displayTitles`); // Use http for local development
        if (response.ok) {
          const data = await response.json();
          setTitles(data);
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
        <Route path="/customer-dashboard" element={
          <PrivateRoute redirectPath="/customer-login">
            <CustomerDashboard /> {/* Render Customer Dashboard here */}
          </PrivateRoute>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/customer" element={
          <PrivateRoute redirectPath="/customer-login">
            <CustomerQuestions triggerRefresh={triggerRefresh} />
          </PrivateRoute>
        } />
        <Route path="/responses" element={<Responses />} />
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
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </a>
                </li>
              </ul>
              
              {activeTab === 'list' && <Questions triggerRefresh={triggerRefresh} />}
              {activeTab === 'treeMap' && <QuestionsTreeMap />}
              {activeTab === 'unlinked' && <UnlinkedQuestions />}
              {activeTab === 'title' && <TitleTab />}
              {activeTab === 'details' && <DetailsTab />}
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
