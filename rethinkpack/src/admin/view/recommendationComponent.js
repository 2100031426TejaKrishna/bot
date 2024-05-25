// import React, { useState } from 'react';

// const RecommendationComponent = ({ recommendations, setRecommendations, handleClick }) => {
//   const [recommendation, setRecommendation] = useState('');

//   const handleInputChange = (e) => {
//     setRecommendation(e.target.value);
//   };

//   const handleClickButton = () => {
//     if (recommendation !== '') {
//       setRecommendations((prevRecommendations) => [...prevRecommendations, recommendation]);
//       setRecommendation('');
//     }
//   };

//   return (
//     <div className="d-flex flex-grow-1 mx-2">
//       <button onClick={handleClickButton}>hint</button>
//       <input
//         type="text"
//         id="recommendation-1"
//         name="recommendation"
//         className="form-control mx-2"
//         value={recommendation}
//         onChange={handleInputChange}
//         style={{ flex: '1' }}
//         placeholder="Type your recommendation here"
//       />
//     </div>
//   );
// };

// export default RecommendationComponent;
// import React, { useState } from 'react';

// const RecommendationComponent = () => {
//     const [details, setDetails] = useState({ recommendation: '' });
//     // const [recommendations, setRecommendations] = useState([]);
//     // const handleClick = () => {
//     //     if (details.recommendation !== '') {
//     //         setRecommendations((prevRecommendations) => [...prevRecommendations, details.recommendation]);
//     //     }
//     // };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setDetails((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
    
    
//     console.log(details);
//     // console.log(recommendations);
//     return (
//         <div className="d-flex flex-grow-1 mx-2">
//             <p>hint</p>
//             <input
//                 type="text"
//                 id="recommendation-1"
//                 name="recommendation"
//                 className="form-control mx-2"
//                 value={details.recommendation}
//                 onChange={handleChange}
//                 style={{ flex: '1' }}
//             />
//         </div>
//     );
// };

// export default RecommendationComponent;
// for homepage selecting recommendations
import React, { useState } from 'react';

const RecommendationComponent = () => {
    const [details, setDetails] = useState({ recommendation: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    
    return (
        <div className="d-flex flex-grow-1 mx-2">
            {submitted ? (
                <p>{details.recommendation}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="recommendation-1">Enter recommendation:</label>
                    <input
                        type="text"
                        id="recommendation-1"
                        name="recommendation"
                        className="form-control mx-2"
                        value={details.recommendation}
                        onChange={handleChange}
                        style={{ flex: '1' }}
                    />
                    <input type="submit" value="Submit" />
                </form>
            )}
        </div>
    );
};

export default RecommendationComponent;

