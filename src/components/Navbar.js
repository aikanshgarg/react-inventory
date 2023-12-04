import AddIcon from "@mui/icons-material/Add";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const Navbar = () => {
  return (
    <div style={{ padding: "0 20px", background: "#fff" }}>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-heading">
            <b style={{ color: "#333" }}>Inventory</b>
          </div>
          <div className="navbar-heading">Collections</div>
          <div className="navbar-heading">Analytics</div>
        </div>
        <div className="navbar-right">
          <button className="navbar-cta navbar-blue-cta">
            <AddIcon /> Add New Product
          </button>
          <span className="navbar-cta">
            <ExtensionOutlinedIcon /> Import Data
          </span>
          <span className="navbar-cta">
            <FileUploadOutlinedIcon /> Export CSV
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
