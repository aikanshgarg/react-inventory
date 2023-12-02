// src/components/ProductList.js
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchProducts } from "../services/api";

const ProductList = () => {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const products = await fetchProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount Percentage</TableCell>
            <TableCell>Inventory</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Lead Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Accordion
                  expanded={expanded === `panel${product.id}`}
                  onChange={handleAccordionChange(`panel${product.id}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${product.id}bh-content`}
                    id={`panel${product.id}bh-header`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: "30px", marginRight: "10px" }}
                    />
                    <Typography>{product.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <Typography>Primary Variants:</Typography>
                      <ul>
                        {product.primary_variants.map((variant) => (
                          <li key={variant.name}>
                            <Accordion>
                              <AccordionSummary>
                                <Typography>{variant.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography>
                                  {variant.price}, {variant.inventory}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Typography>Secondary Variants:</Typography>
                      <ul>
                        {product.secondary_variants
                          ? product.secondary_variants.map(
                              (secondaryVariant) => (
                                <li key={secondaryVariant.name}>
                                  {secondaryVariant.name}:{" "}
                                  {secondaryVariant.price},{" "}
                                  {secondaryVariant.inventory}
                                </li>
                              )
                            )
                          : null}
                      </ul>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.discountPercentage}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>{product.active ? "Yes" : "No"}</TableCell>
              <TableCell>{product.leadTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
