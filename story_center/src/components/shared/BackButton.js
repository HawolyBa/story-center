import React from "react";
import { Link } from "react-router-dom";

const BackButton = ({ text, link }) => {
  return (
    <Link className="back-button btn btn-secondary" to={link}>
      <i className="fas fa-long-arrow-alt-left" /> {text}
    </Link>
  );
};

export default BackButton;
