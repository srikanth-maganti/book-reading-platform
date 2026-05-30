import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "./api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            setIsAuthenticated(true);
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const updateUser = useCallback((userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}