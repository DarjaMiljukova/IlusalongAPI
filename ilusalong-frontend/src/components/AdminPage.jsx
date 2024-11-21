import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
    const [masters, setMasters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [masterName, setMasterName] = useState("");
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        fetchMasters();
        fetchCategories();
    }, []);

    const fetchMasters = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Master`);
            console.log("Masters fetched successfully:", data);
            return data;
        } catch (error) {
            console.error("Error fetching masters:", error.response?.data || error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/Category`);
            console.log("Categories fetched successfully:", data);
            return data;
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
        }
    };

    const addMaster = async (masterName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Master`, {
                name: masterName,
            });
            console.log("Master added successfully:", response.data);
        } catch (error) {
            console.error("Error adding master:", error.response?.data || error.message);
        }
    };

    const addCategory = async (categoryName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Category`, {
                name: categoryName,
            });
            console.log("Category added successfully:", response.data);
        } catch (error) {
            console.error("Error adding category:", error.response?.data || error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Add Master</h2>
                <input
                    type="text"
                    value={masterName}
                    onChange={(e) => setMasterName(e.target.value)}
                    placeholder="Master Name"
                />
                <button onClick={addMaster}>Add Master</button>
            </div>
            <div>
                <h2>Add Category</h2>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                />
                <button onClick={addCategory}>Add Category</button>
            </div>
            <div>
                <h2>Masters</h2>
                <ul>
                    {masters.map((master) => (
                        <li key={master.id}>{master.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;
