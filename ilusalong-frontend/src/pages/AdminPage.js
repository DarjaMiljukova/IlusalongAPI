import React, { useState } from 'react';
import AddMasterForm from '../components/AddMasterForm';
import AddCategoryForm from '../components/AddCategoryForm';


function AdminPage() {
    const [fines, setFines] = useState([]);

    const addFine = (email, amount) => {
        setFines([...fines, { email, amount }]);
        alert(`Fine of €${amount} has been issued to ${email}`);
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Add Masters</h2>
            <AddMasterForm />
            <h2>Add Categories</h2>
            <AddCategoryForm />
            <h2>Issue Fines</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email.value;
                    const amount = e.target.amount.value;
                    addFine(email, amount);
                }}
            >
                <label>Email:</label>
                <input type="email" name="email" required/>
                <br></br>
                <br></br>
                <label>Fine Amount (€):</label>
                <input type="number" name="amount" required/>
                <button type="submit">Issue Fine</button>
            </form>
        </div>
    );
}

export default AdminPage;
