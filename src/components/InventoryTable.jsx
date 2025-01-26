import React, { useState } from "react";
import "../App.css"; // App.css imported
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome
import {
  faPlus,
  faSort,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"; // svg-icons

// Modal Component
const Modal = ({ title, onClose, onConfirm, children }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>{title}</h3>
      {children}
      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);

const InventoryTable = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item A", category: "Electronics", quantity: 15 },
    { id: 2, name: "Item B", category: "Groceries", quantity: 5 },
    { id: 3, name: "Item C", category: "Clothing", quantity: 20 },
  ]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
  });
  const [filter, setFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  //  modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity) {
      alert("Please fill out all fields.");
      return;
    }
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category,
        quantity: parseInt(newItem.quantity, 10),
      },
    ]);
    
    // SetNewItem  Empty
    setNewItem({ name: "", category: "", quantity: "" });
  };

  const handleEditItem = () => {
    if (
      !itemToEdit.name ||
      !itemToEdit.category ||
      isNaN(itemToEdit.quantity)
    ) {
      alert("Invalid input. Edit canceled.");
      return;
    }
    setItems(
      items.map((item) =>
        item.id === itemToEdit.id
          ? {
              ...item,
              name: itemToEdit.name,
              category: itemToEdit.category,
              quantity: itemToEdit.quantity,
            }
          : item
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = () => {
    setItems(items.filter((item) => item.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
  };

  // filtering Items
  const filteredItems = filter
    ? items.filter((item) =>
        item.category.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  // Sorting Items
  const sortedItems = filteredItems.sort((a, b) =>
    sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity
  );

  return (
    <div className="inventory-app">
      <h1>Inventory Management</h1>

      {/* Add Item Section */}
      <div className="add-item">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <button onClick={handleAddItem}>
          <FontAwesomeIcon icon={faPlus} /> Add Item
        </button>
      </div>

      {/* Filter and Sort Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={() => setSortAsc(!sortAsc)}>
          <FontAwesomeIcon icon={faSort} /> Sort by Quantity (
          {sortAsc ? "Asc" : "Desc"})
        </button>
      </div>

      {/* Table Section */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id} className={item.quantity < 10 ? "low-stock" : ""}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  onClick={() => {
                    setItemToEdit(item);
                    setIsEditModalOpen(true);
                  }}
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setIsDeleteModalOpen(true);
                  }}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal
          title="Edit Item"
          onClose={() => setIsEditModalOpen(false)}
          onConfirm={handleEditItem}
        >
          <input
            type="text"
            placeholder="Name"
            value={itemToEdit?.name || ""}
            onChange={(e) =>
              setItemToEdit({ ...itemToEdit, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            value={itemToEdit?.category || ""}
            onChange={(e) =>
              setItemToEdit({ ...itemToEdit, category: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            value={itemToEdit?.quantity || ""}
            onChange={(e) =>
              setItemToEdit({ ...itemToEdit, quantity: e.target.value })
            }
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteItem}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      )}
    </div>
  );
};

export default InventoryTable;
