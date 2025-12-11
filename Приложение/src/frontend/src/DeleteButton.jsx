import React from "react";

export default function DeleteButton({ onDelete, selectedIds }) {

    const handleDelete = () => {
        if (selectedIds.length === 0) return;
        onDelete(selectedIds);

    };

    return (
        <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="delete-button"
        >
            Delete Selected ({selectedIds.length})
        </button>
    );
}