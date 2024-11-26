import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const role = localStorage.getItem('role');

    return (
        <header>
            <nav>
                {role === 'admin' && <Link to="/admin">Admin</Link>}
                {role === 'master' && <Link to="/master">Master</Link>}
                {role === 'client' && (
                    <>
                        <Link to="/client">Client</Link>
                        <Link to="/client/booking">Book</Link>
                    </>
                )}
                <Link to="/login" onClick={() => localStorage.clear()}>Logout</Link>
            </nav>
        </header>
    );
}

export default Header;
