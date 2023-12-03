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

const ProductList1 = () => {
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
      // Check if there is original data in local storage
      const originalData = getOriginalDataFromLocalStorage();

      // If there is original data, use it; otherwise, fetch from the API
      const apiData = await fetchProducts();
      const products = originalData.length
        ? updateOriginalDataWithApiData(apiData, originalData)
        : apiData;

      // Save the initial data to local storage
      saveOriginalDataToLocalStorage(apiData);

      setProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateOriginalDataWithApiData = (apiData, originalData) => {
    // Update the original data with API data based on product IDs
    const updatedData = originalData.map((originalProduct) => {
      const apiProduct = apiData.find((p) => p.id === originalProduct.id) || {};
      return { ...apiProduct, ...originalProduct };
    });

    return updatedData;
  };

  // Function to get the original data from local storage
  const getOriginalDataFromLocalStorage = () => {
    const originalData = localStorage.getItem("originalData");
    return originalData ? JSON.parse(originalData) : [];
  };

  // Function to save the initial data to local storage
  const saveOriginalDataToLocalStorage = (data) => {
    localStorage.setItem("originalData", JSON.stringify(data));
  };

  // Function to save the edited data to local storage
  const saveEditedDataToLocalStorage = (
    productId,
    field,
    value,
    variantName,
    secondaryVariantName
  ) => {
    // Get the edited data from local storage
    const editedData = getOriginalDataFromLocalStorage();

    // Find the product in the array
    const productIndex = editedData.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const product = editedData[productIndex];

      if (!variantName) {
        // If the field is not related to variants, update it directly in the product
        product[field] = value;
      } else {
        // Find the variant index in primary_variants array
        const variantIndex = product.primary_variants.findIndex(
          (v) => v.name === variantName
        );

        if (variantIndex !== -1) {
          if (!secondaryVariantName) {
            // If no secondaryVariantName, update the primary variant name
            product.primary_variants[variantIndex].name = value;
          } else {
            // Find the secondary variant index in secondary_variants array
            const secondaryVariantIndex = product.primary_variants[
              variantIndex
            ].secondary_variants.findIndex(
              (sv) => sv.name === secondaryVariantName
            );

            if (secondaryVariantIndex !== -1) {
              // Update the field in the secondary variant
              product.primary_variants[variantIndex].secondary_variants[
                secondaryVariantIndex
              ][field] = value;
            }
          }
        }
      }

      // Update the product in the array
      editedData[productIndex] = product;

      // Save the edited data back to local storage
      localStorage.setItem("originalData", JSON.stringify(editedData));
    }
  };

  // Function to handle the save action for editable fields
  const handleEditSave = (
    field,
    value,
    productId,
    variantName = null,
    secondaryVariantName = null
  ) => {
    // Save changes to local storage
    saveEditedDataToLocalStorage(
      productId,
      field,
      value,
      variantName,
      secondaryVariantName
    );

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
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
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
                    <div className="active-pill">
                      {product.active ? "Yes" : "No"}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="description">
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
                                          "name",
                                          value,
                                          product.id,
                                          variant.name
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
                                          product.id,
                                          variant.name
                                        )
                                      }
                                    >
                                      {`$${variant.price}`}
                                    </EditableField>
                                    (
                                    <EditableField
                                      onSave={(value) =>
                                        handleEditSave(
                                          "inventory",
                                          value,
                                          product.id,
                                          variant.name
                                        )
                                      }
                                    >
                                      {variant.inventory}
                                    </EditableField>{" "}
                                    left)
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
                                              "name",
                                              value,
                                              product.id,
                                              variant.name,
                                              secondaryVariant.name
                                            )
                                          }
                                        >
                                          {secondaryVariant.name}
                                        </EditableField>
                                        :
                                        <EditableField
                                          onSave={(value) =>
                                            handleEditSave(
                                              "price",
                                              value,
                                              product.id,
                                              variant.name,
                                              secondaryVariant.name
                                            )
                                          }
                                        >
                                          {`$${secondaryVariant.price}`}
                                        </EditableField>
                                        (
                                        <EditableField
                                          onSave={(value) =>
                                            handleEditSave(
                                              "inventory",
                                              value,
                                              product.id,
                                              variant.name,
                                              secondaryVariant.name
                                            )
                                          }
                                        >
                                          {secondaryVariant.inventory}
                                        </EditableField>{" "}
                                        left)
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

export default ProductList1;
