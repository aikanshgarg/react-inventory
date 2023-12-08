import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const EditableField = ({ onSave, children }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(children);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSave = () => {
    onSave(editedContent);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(children);
    setEditing(false);
  };

  const handleChange = (event) => {
    setEditedContent(event.target.value);
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={
              typeof editedContent === "object"
                ? editedContent.props.children
                : editedContent
            }
            onChange={handleChange}
            onBlur={handleSave}
            className="edit-input"
          />
          <button
            onClick={handleSave}
            className="is-editing"
            style={{ color: "forestgreen" }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="is-editing"
            style={{ color: "#7e88c3" }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="content-with-edit-box">
            <span>
              {typeof editedContent === "object"
                ? editedContent.props.children
                : editedContent}
            </span>
            <button onClick={handleEditClick} className="edit-icon">
              <EditOutlinedIcon /> Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditableField;
