// // src/components/InventoryTable.js
// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { fetchProducts } from "../services/api";

// export default function InventoryTable() {
//   const [rows, setRows] = useState([]);

//   const columns = [
//     { field: "title", headerName: "Title", flex: 1 },
//     { field: "stock", headerName: "Stock", flex: 1 },
//     { field: "WHS", headerName: "WHS", flex: 1 },
//     { field: "discountPercentage", headerName: "Discount %", flex: 1 },
//     { field: "color", headerName: "Color", flex: 1 },
//     { field: "sizes", headerName: "Sizes", flex: 1 },
//     { field: "inventory", headerName: "Inventory", flex: 1 },
//     { field: "leadTime", headerName: "Lead Time", flex: 1 },
//   ];

//   useEffect(() => {
//     fetchInventoryData();
//   }, []);

//   const fetchInventoryData = async () => {
//     try {
//       const products = await fetchProducts();
//       const updatedRows = products.map((product) => {
//         const colors = product.primary_variants.map((variant) => variant.name);
//         const sizes =
//           product.primary_variants.length > 0
//             ? product.primary_variants[0].secondary_variants.map(
//                 (size) => size.name
//               )
//             : [];

//         return {
//           id: product.id,
//           title: product.title,
//           stock: product.inventory,
//           WHS: product.price,
//           discountPercentage: product.discountPercentage,
//           color: colors.join(", "),
//           sizes: sizes.join(", "),
//           inventory: product.inventory,
//           leadTime: product.leadTime,
//         };
//       });
//       setRows(updatedRows);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <div style={{ height: 500, width: "100%" }}>
//       <DataGrid rows={rows} columns={columns} pageSize={10} />
//     </div>
//   );
// }
