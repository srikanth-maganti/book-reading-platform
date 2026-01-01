import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useContext } from 'react'
import { AuthContext } from "../utils/AuthContext.jsx"


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const { isauthenticated, setisauthenticated } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get("search") || "";
        setQuery(searchParam);
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed === "") return;

        navigate(`/books?search=${encodeURIComponent(trimmed)}`);
    };

    const handlelogout = () => {
        localStorage.removeItem("token");
        setisauthenticated(false);

    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-light border-bottom fixed-top ">
                <div className="container-fluid d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <Link className="navbar-brand" to="/">
                            <i className="fa-duotone fa-solid fa-book"><b>Project</b></i>
                        </Link>

                        <form className="d-flex w-50" role="search" onSubmit={handleSubmit}>
                            <input
                                className="form-control me-2"
                                name="search"
                                id="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>


                        {isauthenticated ? (<div className="d-flex align-items-center gap-3">
                            <Link to={""} className="fs-3 text-dark"><i class="fa-solid fa-user"></i></Link>
                            <button className="btn btn-outline-primary" onClick={handlelogout}>Logout</button>
                            <Link to="/cart" className="btn btn-outline-secondary">
                                <i className="fa-solid fa-cart-shopping"></i> Cart
                            </Link>
                        </div>) :
                            (
                                <div className="d-flex align-items-center gap-3">
                                    <Link to="/login" className="btn btn-outline-primary">Login</Link>
                                </div>
                            )


                        }

                    </div>

                 

                    <div className="navbar-collapse mt-2 bg-body-tertiary w-100">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-left w-100">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/books">Browse Books</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/seller">Sell a Book</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
