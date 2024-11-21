import React, { useState } from "react";
import "./SubscribePage.css";

const Subscribe = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSubscribeClick = (planTitle) => {
    setSelectedPlan(planTitle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlan("");
  };

  return (
    <div className="subscribe-container">
      <h1 className="subscribe-heading">Choose Your Subscription Plan</h1>
      <div className="cards-container">
        {[
          {
            title: "Basic Plan",
            price: "$10/month",
            features: ["Access to basic features", "5GB Storage", "Email Support"],
          },
          {
            title: "Pro Plan",
            price: "$20/month",
            features: [
              "Access to all features",
              "50GB Storage",
              "Priority Email Support",
              "Advanced Analytics",
            ],
          },
          {
            title: "Enterprise Plan",
            price: "$50/month",
            features: [
              "Unlimited features",
              "500GB Storage",
              "24/7 Support",
              "Dedicated Account Manager",
            ],
          },
        ].map((plan, index) => (
          <div className="card" key={index}>
            <h2 className="card-title">{plan.title}</h2>
            <p className="card-price">{plan.price}</p>
            <ul className="card-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
              className="subscribe-button"
              onClick={() => handleSubscribeClick(plan.title)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h2>Subscription Form</h2>
            <p>You have selected the <strong>{selectedPlan}</strong>.</p>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label>Card Details:</label>
                <input type="text" placeholder="Enter your card details" required />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input type="text" placeholder="Enter your address" required />
              </div>
              <button type="submit" className="pay-button">
                Pay Now
              </button>
            </form>
            <button className="close-button" onClick={handleCloseForm}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribe;
