import React, { useState } from 'react';

function AddCategoryForm() {
    const [category, setCategory] = useState('');

    const handleAddCategory = (e) => {
        e.preventDefault();
        alert(`Category "${category}" added successfully!`);
        setCategory('');
    };

    return (
        <form onSubmit={handleAddCategory}>
            <label>Category Name:</label>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />
            <button type="submit">Add Category</button>
        </form>
    );
}

export default AddCategoryForm;
