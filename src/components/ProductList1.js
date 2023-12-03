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
      // Check if there is data in local storage
      const storedData = getStoredDataFromLocalStorage();

      // If there is data, use it; otherwise, fetch from the API
      const apiData = await fetchProducts();
      const updatedData = mergeApiAndStoredData(apiData, storedData);

      // Save the data to local storage
      saveDataToLocalStorage(updatedData);

      setProducts(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const mergeApiAndStoredData = (apiData, storedData) => {
    return apiData.map((apiProduct) => {
      const storedProduct = storedData.find(
        (storedProduct) => storedProduct.id === apiProduct.id
      );

      return storedProduct ? { ...apiProduct, ...storedProduct } : apiProduct;
    });
  };

  const getStoredDataFromLocalStorage = () => {
    const storedData = localStorage.getItem("storedData");
    return storedData ? JSON.parse(storedData) : [];
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("storedData", JSON.stringify(data));
  };

  const saveEditedDataToLocalStorage = (
    productId,
    field,
    value,
    variantName,
    secondaryVariantName
  ) => {
    // Get the data from local storage
    const storedData = getStoredDataFromLocalStorage();

    // Find the product in the array
    const productIndex = storedData.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const product = storedData[productIndex];

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
      storedData[productIndex] = product;

      // Save the data back to local storage
      saveDataToLocalStorage(storedData);
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
