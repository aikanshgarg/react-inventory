// src/components/Variant.js
import React from "react";

const Variant = ({ variant }) => {
  return (
    <div>
      <p>{variant.name}</p>
      {/* Add fields for editing */}
      {/* Display secondary variants if available */}
    </div>
  );
};

export default Variant;
