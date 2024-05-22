import React, { useState } from 'react';
// import Questions from './questions';
const RecommendationComponent = (details,handleChange) => {
    

    console.log(details); 
    return (
        <div className="d-flex flex-grow-1 mx-2">
            <p>hint:</p>
            <input
                type="text"
                id="recommendation-1"
                name="recommendation"
                className="form-control mx-2"
                value={details.recommendation}
                onChange={handleChange}
                // placeholder="Recommendation"
                style={{ flex: '1' }}
            />
            {/* <Questions details={details}/> */}
        </div>
    );
};

export default RecommendationComponent;



