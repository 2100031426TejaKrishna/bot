import React, { useState, useEffect } from 'react';

const DetailsTab = () => {
  const [titles, setTitles] = useState([]);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [questions, setQuestions] = useState({});
  const destination = "localhost:5000"; // Ensure the destination matches your server configuration

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch(`http://${destination}/api/displayAllTitles`); // Use http for local development
        if (response.ok) {
          const data = await response.json();
          setTitles(data);
        } else {
          console.error('Failed to fetch titles');
        }
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };

    fetchTitles();
  }, []);

  const fetchQuestionsByTitleId = async (titleId) => {
    try {
      const response = await fetch(`http://${destination}/api/questionsByTitleId/${titleId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(prevState => ({
          ...prevState,
          [titleId]: data
        }));
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const toggleExpand = (event, title) => {
    event.preventDefault();
    const titleId = title._id;
    const isExpanded = !expandedTitles[titleId];

    setExpandedTitles(prevState => ({
      ...prevState,
      [titleId]: isExpanded
    }));

    if (isExpanded && !questions[titleId]) {
      fetchQuestionsByTitleId(titleId);
    }
  };

  const renderQuestions = (questions) => {
    return (
      <div>
        {questions.map(question => (
          <p key={question._id}>{question.question}</p>
        ))}
      </div>
    );
  };

  const renderTitles = (title, level = 0, label = 'Title') => {
    const titleId = title._id;
    const isExpanded = expandedTitles[titleId];
    const titleQuestions = questions[titleId] || [];

    return (
      <div key={titleId} style={{ marginLeft: level * 20 }}>
        <div>
          <a href="#" onClick={(event) => toggleExpand(event, title)}>
            {label}: {title.titleLabel || title.subTitleLabel || title.nestedTitleLabel || title.subNestedTitleLabel || title.subSubNestedTitleLabel}
          </a>
          {isExpanded && (
            <div>
              {titleQuestions.length > 0 && renderQuestions(titleQuestions)}
              {title.subTitle && title.subTitle.map(subTitle => renderTitles(subTitle, level + 1, 'Subtitle'))}
              {title.nestedTitle && title.nestedTitle.map(nestedTitle => renderTitles(nestedTitle, level + 1, 'Nested Title'))}
              {title.subNestedTitle && title.subNestedTitle.map(subNestedTitle => renderTitles(subNestedTitle, level + 1, 'Subnested Title'))}
              {title.subSubNestedTitle && title.subSubNestedTitle.map(subSubNestedTitle => renderTitles(subSubNestedTitle, level + 1, 'Subsub Nested Title'))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>All Titles</h2>
      {titles.length > 0 ? (
        titles.map((title, index) => (
          renderTitles(title.title, 0, 'Title')
        ))
      ) : (
        <p>No titles available.</p>
      )}
    </div>
  );
};

export default DetailsTab;
