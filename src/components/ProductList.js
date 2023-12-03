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

  const mergeEditedDataWithApiData = (apiData, editedData) => {
    const mergedData = apiData.map((product) => {
      const editedProductData = editedData[product.id] || {};

      const mergedProduct = {
        ...product,
        ...editedProductData,
        primary_variants: product.primary_variants.map((variant) => {
          const variantName = variant.name.toLowerCase();
          const editedVariantData = editedProductData[variantName] || {};

          return {
            ...variant,
            ...editedVariantData,
            secondary_variants: variant.secondary_variants.map(
              (secondaryVariant) => {
                const secondaryVariantName =
                  secondaryVariant.name.toLowerCase();
                const editedSecondaryVariantData =
                  editedVariantData[secondaryVariantName] || {};

                return {
                  ...secondaryVariant,
                  ...editedSecondaryVariantData,
                };
              }
            ),
          };
        }),
      };

      return mergedProduct;
    });

    return mergedData;
  };

  // Function to get the edited data from local storage
  const getEditedDataFromLocalStorage = () => {
    const editedData = localStorage.getItem("editedData");
    return editedData ? JSON.parse(editedData) : {};
  };

  const saveEditedDataToLocalStorage = (
    productId,
    field,
    value,
    variantName,
    secondaryVariantName
  ) => {
    const editedData = getEditedDataFromLocalStorage();
    const productData = editedData[productId] || {};

    if (!variantName) {
      // If the field is not related to variants, store it directly in productData
      productData[field] = value;
    } else {
      // Check if the primary_variants key exists, if not, create it as an array
      productData.primary_variants = productData.primary_variants || [];

      // Find the index of the variant in the array or return -1
      const variantIndex = productData.primary_variants.findIndex(
        (v) => v.name === variantName
      );

      if (variantIndex === -1) {
        // If the variant is not found, push a new object with the name
        const newVariant = {
          name: variantName,
          secondary_variants: [],
        };
        productData.primary_variants.push(newVariant);
      } else {
        // If there are secondary variants in the next index, copy them over
        if (variantIndex < productData.primary_variants.length - 1) {
          productData.primary_variants[variantIndex].secondary_variants =
            productData.primary_variants[variantIndex + 1].secondary_variants;

          // Remove the next index
          productData.primary_variants.splice(variantIndex + 1, 1);
        }
      }

      // Find the index of the primary variant in the array
      const primaryVariantIndex = productData.primary_variants.findIndex(
        (v) => v.name === variantName
      );

      // If secondaryVariantName is not provided, it means the primary variant itself is being edited
      if (!secondaryVariantName) {
        // Update the name of the primary variant
        productData.primary_variants[primaryVariantIndex].name = value;
      } else {
        // Find the index of the secondary variant in the array or return -1
        const secondaryVariantIndex = productData.primary_variants[
          primaryVariantIndex
        ].secondary_variants.findIndex(
          (sv) => sv.name === secondaryVariantName
        );

        if (secondaryVariantIndex === -1) {
          // If the secondary variant is not found, push a new object with the name and field
          const newSecondaryVariant = {
            name: secondaryVariantName,
            [field]: value,
          };
          productData.primary_variants[
            primaryVariantIndex
          ].secondary_variants.push(newSecondaryVariant);
        } else {
          // If the secondary variant is found, update the field in the existing object
          productData.primary_variants[primaryVariantIndex].secondary_variants[
            secondaryVariantIndex
          ][field] = value;
        }
      }
    }

    editedData[productId] = productData;
    localStorage.setItem("editedData", JSON.stringify(editedData));
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

export default ProductList;
