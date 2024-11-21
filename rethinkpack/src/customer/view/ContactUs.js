import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contactus-container">
      <h1 className="contactus-heading">
        Let's explore together how we can collaborate with revolutionary
        shifting the packaging practice & make an impact for our environment!
      </h1>
      <form className="contactus-form">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" />

        <label htmlFor="organisation">Organisation:</label>
        <input
          type="text"
          id="organisation"
          name="organisation"
          placeholder="Enter your organisation"
        />

        <label htmlFor="designation">Designation:</label>
        <input
          type="text"
          id="designation"
          name="designation"
          placeholder="Enter your designation"
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Enter your message"
        ></textarea>

        <button type="submit" className="contactus-button">
          Contact us
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
