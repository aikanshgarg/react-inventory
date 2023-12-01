// src/components/Product.js
import React, { useState } from "react";
import VariantList from "./VariantList";

const Product = ({ product }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <h2 onClick={toggleExpand}>{product.title}</h2>
      {expanded && <VariantList variants={product.primary_variants} />}
    </div>
  );
};

export default Product;
