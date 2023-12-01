// src/components/VariantList.js
import React, { useState } from "react";
import Variant from "./Variant";

const VariantList = ({ variants }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <h3 onClick={toggleExpand}>Variants</h3>
      {expanded && (
        <div>
          {variants.map((variant) => (
            <Variant key={variant.name} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantList;
