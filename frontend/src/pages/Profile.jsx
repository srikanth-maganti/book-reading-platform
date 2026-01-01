import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Profile.css';

function Profile() {
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [favItems, setFavItems] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const navigate = useNavigate();

    // Sample user data
    useEffect(() => {
        const sampleUser = {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+91 9876543210',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            address: {
                street: '123 Book Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                country: 'India'
            },
            joinDate: '2023-01-15',
            totalOrders: 12,
            totalSpent: 8450
        };
        setUser(sampleUser);
        setEditedUser(sampleUser);

        // Sample orders data
        const sampleOrders = [
            {
                id: 'ORD001',
                date: '2024-06-25',
                status: 'Delivered',
                total: 1299,
                items: [
                    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 399, quantity: 1 },
                    { title: 'Atomic Habits', author: 'James Clear', price: 450, quantity: 2 }
                ]
            },
            {
                id: 'ORD002',
                date: '2024-06-20',
                status: 'Shipped',
                total: 899,
                items: [
                    { title: 'Sapiens', author: 'Yuval Noah Harari', price: 599, quantity: 1 },
                    { title: 'The Alchemist', author: 'Paulo Coelho', price: 300, quantity: 1 }
                ]
            },
            {
                id: 'ORD003',
                date: '2024-06-15',
                status: 'Processing',
                total: 1599,
                items: [
                    { title: 'Clean Code', author: 'Robert C. Martin', price: 799, quantity: 1 },
                    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', price: 400, quantity: 2 }
                ]
            }
        ];
        setOrders(sampleOrders);

        // Sample favorite items
        const sampleFavItems = [
            {
                id: 1,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 449,
                originalPrice: 599,
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop',
                rating: 4.8,
                discount: 25
            },
            {
                id: 2,
                title: 'The Psychology of Money',
                author: 'Morgan Housel',
                price: 549,
                originalPrice: 699,
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=280&fit=crop',
                rating: 4.5,
                discount: 21
            },
            {
                id: 3,
                title: '1984',
                author: 'George Orwell',
                price: 299,
                originalPrice: 399,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop',
                rating: 4.7,
                discount: 25
            }
        ];
        setFavItems(sampleFavItems);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setUser(editedUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedUser(user);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEditedUser(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setEditedUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#28a745';
            case 'Shipped': return '#007bff';
            case 'Processing': return '#ffc107';
            case 'Cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const removeFavorite = (id) => {
        setFavItems(favItems.filter(item => item.id !== id));
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                {/* Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img src={user.avatar} alt="Profile" />
                            <div className="avatar-overlay">
                                <i className="camera-icon">📷</i>
                            </div>
                        </div>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">{user.totalOrders}</span>
                                <span className="stat-label">Orders</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">₹{user.totalSpent}</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                        </div>
                    </div>

                    <nav className="profile-nav">
                        <button 
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <i className="icon">👤</i>
                            Profile Info
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <i className="icon">📦</i>
                            My Orders
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <i className="icon">❤️</i>
                            Favorites
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <i className="icon">⚙️</i>
                            Settings
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="profile-content">
                    {/* Profile Info Tab */}
                    {activeTab === 'profile' && (
                        <div className="content-section">
                            <div className="section-header">
                                <h3>Profile Information</h3>
                                {!isEditing ? (
                                    <button className="edit-btn" onClick={handleEdit}>
                                        ✏️ Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="save-btn" onClick={handleSave}>
                                            ✅ Save
                                        </button>
                                        <button className="cancel-btn" onClick={handleCancel}>
                                            ❌ Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedUser.name || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedUser.email || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editedUser.phone || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Member Since</label>
                                        <input
                                            type="text"
                                            value={new Date(user.joinDate).toLocaleDateString()}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <h4>Address Information</h4>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={editedUser.address?.street || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={editedUser.address?.city || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={editedUser.address?.state || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input
                                            type="text"
                                            name="address.pincode"
                                            value={editedUser.address?.pincode || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="content-section">
                            <div className="section-header">
                                <h3>My Orders</h3>
                                <span className="order-count">{orders.length} Orders</span>
                            </div>

                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <h4>Order #{order.id}</h4>
                                                <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="order-status">
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                                >
                                                    {order.status}
                                                </span>
                                                <p className="order-total">₹{order.total}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="order-items">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <span>{item.title} by {item.author}</span>
                                                    <span>Qty: {item.quantity} × ₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="order-actions">
                                            <button className="track-btn">Track Order</button>
                                            <button className="reorder-btn">Reorder</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="content-section">
                            <div className="section-header">
                                <h3>My Favorites</h3>
                                <span className="fav-count">{favItems.length} Books</span>
                            </div>

                            <div className="favorites-grid">
                                {favItems.map(book => (
                                    <div key={book.id} className="favorite-card">
                                        <div className="book-image">
                                            <img src={book.image} alt={book.title} />
                                            <button 
                                                className="remove-fav"
                                                onClick={() => removeFavorite(book.id)}
                                            >
                                                ❌
                                            </button>
                                            {book.discount && (
                                                <div className="discount-badge">
                                                    {book.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                        <div className="book-info">
                                            <h4>{book.title}</h4>
                                            <p>by {book.author}</p>
                                            <div className="book-rating">
                                                <span className="stars">⭐ {book.rating}</span>
                                            </div>
                                            <div className="book-price">
                                                <span className="current-price">₹{book.price}</span>
                                                {book.originalPrice && (
                                                    <span className="original-price">₹{book.originalPrice}</span>
                                                )}
                                            </div>
                                            <button className="add-to-cart-btn">
                                                🛒 Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="content-section">
                            <div className="section-header">
                                <h3>Account Settings</h3>
                            </div>

                            <div className="settings-grid">
                                <div className="setting-card">
                                    <h4>🔔 Notifications</h4>
                                    <p>Manage your notification preferences</p>
                                    <div className="setting-options">
                                        <label className="setting-option">
                                            <input type="checkbox" defaultChecked />
                                            Email notifications for orders
                                        </label>
                                        <label className="setting-option">
                                            <input type="checkbox" defaultChecked />
                                            SMS notifications for delivery
                                        </label>
                                        <label className="setting-option">
                                            <input type="checkbox" />
                                            Promotional offers and deals
                                        </label>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <h4>🔒 Privacy</h4>
                                    <p>Control your privacy settings</p>
                                    <div className="setting-options">
                                        <label className="setting-option">
                                            <input type="checkbox" defaultChecked />
                                            Make my reviews public
                                        </label>
                                        <label className="setting-option">
                                            <input type="checkbox" />
                                            Share reading preferences
                                        </label>
                                    </div>
                                </div>

                                <div className="setting-card">
                                    <h4>🔑 Security</h4>
                                    <p>Keep your account secure</p>
                                    <div className="setting-actions">
                                        <button className="security-btn">Change Password</button>
                                        <button className="security-btn">Enable 2FA</button>
                                    </div>
                                </div>

                                <div className="setting-card danger">
                                    <h4>⚠️ Danger Zone</h4>
                                    <p>Irreversible account actions</p>
                                    <div className="setting-actions">
                                        <button className="danger-btn">Deactivate Account</button>
                                        <button className="danger-btn">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;