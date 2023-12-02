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
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchProducts } from "../services/api";

import EditableField from "./EditableField.js";

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
      // Check if there is edited data in local storage
      const editedData = getEditedDataFromLocalStorage();

      // If there is edited data, use it; otherwise, fetch from the API
      const apiData = await fetchProducts();
      const products = Object.keys(editedData).length
        ? mergeEditedDataWithApiData(apiData, editedData)
        : apiData;

      setProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to merge edited data with API data
  const mergeEditedDataWithApiData = (apiData, editedData) => {
    const mergedData = apiData.map((product) => {
      const editedProductData = editedData[product.id] || {};
      return {
        ...product,
        ...editedProductData,
      };
    });
    return mergedData;
  };

  // Function to get the edited data from local storage
  const getEditedDataFromLocalStorage = () => {
    const editedData = localStorage.getItem("editedData");
    return editedData ? JSON.parse(editedData) : {};
  };

  // Function to save the edited data to local storage
  const saveEditedDataToLocalStorage = (productId, field, value) => {
    const editedData = getEditedDataFromLocalStorage();
    const productData = editedData[productId] || {};
    productData[field] = value;
    editedData[productId] = productData;
    localStorage.setItem("editedData", JSON.stringify(editedData));
  };

  // Function to handle the save action for editable fields
  const handleEditSave = (field, value, productId) => {
    // Save changes to local storage
    saveEditedDataToLocalStorage(productId, field, value);

    // Other logic to update state or perform additional actions if needed
    console.log(`Save ${field} for product ${productId}: ${value}`);
  };

  // Mapping function for sizes
  const mapSize = (size) => {
    const sizeMap = {
      Small: "S",
      Medium: "M",
      Large: "L",
      "Extra Large": "XL",
    };
    return sizeMap[size] || size;
  };

  // Mapping function for colors
  const mapColor = (color) => (
    <Box
      key={color}
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 0.5,
        display: "inline-block",
      }}
    />
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>WHS</TableCell>
            <TableCell>Discount %</TableCell>
            <TableCell>Colors</TableCell>
            <TableCell>Sizes</TableCell>
            <TableCell>Inventory</TableCell>
            <TableCell>Lead Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.category}</TableCell>

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
                    <Typography>
                      <EditableField
                        onSave={(value) =>
                          handleEditSave("title", value, product.id)
                        }
                      >
                        {product.title}
                      </EditableField>
                    </Typography>
                    <div>{product.active ? "Yes" : "No"}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <EditableField
                        onSave={(value) =>
                          handleEditSave("description", value, product.id)
                        }
                      >
                        {product.description}
                      </EditableField>
                    </div>

                    <div>
                      <Typography>{product.primary_variant_name}s</Typography>
                      <ul>
                        {product.primary_variants.map((variant) => (
                          <li key={variant.name}>
                            <Accordion>
                              <AccordionSummary>
                                <div>
                                  <Typography>
                                    <EditableField
                                      onSave={(value) =>
                                        handleEditSave(
                                          "primary_variant",
                                          value,
                                          product.id
                                        )
                                      }
                                    >
                                      {variant.name}
                                    </EditableField>
                                  </Typography>
                                  <Typography>
                                    <EditableField
                                      onSave={(value) =>
                                        handleEditSave(
                                          "price",
                                          value,
                                          product.id
                                        )
                                      }
                                    >
                                      {`$${variant.price}`}
                                    </EditableField>
                                    <EditableField
                                      onSave={(value) =>
                                        handleEditSave(
                                          "inventory",
                                          value,
                                          product.id
                                        )
                                      }
                                    >
                                      ({variant.inventory} left)
                                    </EditableField>
                                  </Typography>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography>
                                  {product.secondary_variant_name}s
                                </Typography>
                                <ul>
                                  {variant.secondary_variants.map(
                                    (secondaryVariant) => (
                                      <li key={secondaryVariant.name}>
                                        <EditableField
                                          onSave={(value) =>
                                            handleEditSave(
                                              "secondary_variant",
                                              value,
                                              product.id
                                            )
                                          }
                                        >
                                          {secondaryVariant.name}
                                        </EditableField>
                                        :
                                        <EditableField
                                          onSave={(value) =>
                                            handleEditSave(
                                              "secondary_variant_price",
                                              value,
                                              product.id
                                            )
                                          }
                                        >
                                          {`$${secondaryVariant.price}`}
                                        </EditableField>
                                        <EditableField
                                          onSave={(value) =>
                                            handleEditSave(
                                              "secondary_variant_inventory",
                                              value,
                                              product.id
                                            )
                                          }
                                        >
                                          ({secondaryVariant.inventory} left)
                                        </EditableField>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </AccordionDetails>
                            </Accordion>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
              <TableCell>
                <span>
                  $
                  <EditableField
                    onSave={(value) =>
                      handleEditSave("price", value, product.id)
                    }
                  >
                    {product.price}
                  </EditableField>
                </span>
              </TableCell>
              <TableCell>
                <EditableField
                  onSave={(value) =>
                    handleEditSave("discountPercentage", value, product.id)
                  }
                >
                  {product.discountPercentage}%
                </EditableField>
              </TableCell>
              <TableCell>
                {product.primary_variants.map((variant) =>
                  mapColor(variant.name)
                )}
              </TableCell>
              <TableCell>
                {product.primary_variants.length > 0 &&
                  product.primary_variants[0].secondary_variants
                    .map((sizeVariant) => mapSize(sizeVariant.name))
                    .join(", ")}
              </TableCell>
              <TableCell>
                <EditableField
                  onSave={(value) =>
                    handleEditSave("inventory", value, product.id)
                  }
                >
                  {product.inventory}
                </EditableField>
              </TableCell>
              <TableCell>
                <EditableField
                  onSave={(value) =>
                    handleEditSave("leadTime", value, product.id)
                  }
                >
                  {product.leadTime}
                </EditableField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
