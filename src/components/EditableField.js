import React, { useState } from "react";

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
            value={editedContent}
            onChange={handleChange}
            onBlur={handleSave}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span>{editedContent}</span>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
    </div>
  );
};

export default EditableField;
