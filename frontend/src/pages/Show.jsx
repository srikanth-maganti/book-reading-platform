import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Show() {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [book,setbook]=useState([]);
    const navigate=useNavigate();
    const {id}=useParams();
    const token=localStorage.getItem("token");
    
    useEffect(()=>{
        const fetchdata=async()=>{
            try{
                console.log("hello");
                const response=await fetch(`http://localhost:3000/books/show/${id}`);
                
                if(response.ok)
                {
                    const data=await response.json();
                    setbook(data);
                }
                else
                {
                    throw new Error("book not found");
                }
            }
            catch
            {
                 console.error(error);
                 setbook([]);
            }
        }
        fetchdata();
    },[])

    const similarBooks = [
        { title: "This Side of Paradise", author: "F. Scott Fitzgerald", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { title: "The Catcher in the Rye", author: "J.D. Salinger", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { title: "To Kill a Mockingbird", author: "Harper Lee", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ];

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star text-warning"></i>);
        }
        
        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
        }
        
        return stars;
    };
     async function handleaddtocart()
    {   
        try{
            const response=await fetch(`http://localhost:3000/cart/${id}`,{
            method:'POST',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            
            })
            
             if(!response.ok) throw new Error("Unable to add to cart");
             console.log("added to cart");
        }
        catch(err){
                console.log(err.message);
        }
       
    }

    async function handlebuynow()
    {
         try{
            const response=await fetch(`http://localhost:3000/cart/${id}`,{
            method:'POST',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            
            })
            
             if(!response.ok) throw new Error("Unable to add to cart");
            
             navigate("/cart")
            }
            catch(err){
                    console.log(err);
            }
    }
    return (
        <>
           
            
            <div className="container-fluid bg-light min-vh-100 py-4">
                <div className="container-fluid">
                    

                    {/* Main Product Section */}
                    <div className="row bg-white rounded-3 shadow-sm p-4 mb-5">
                        <div className="col-lg-5 col-md-6 mb-4">
                            <div className="position-relative">
                                <img 
                                    src={book.Image} 
                                    className="img-fluid rounded-3 shadow-sm" 
                                    alt={book.Title}
                                    style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
                                />
                                {!book.Quantity>0 && (
                                    <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end">
                                        Out of Stock
                                    </div>
                                )}
                                {book.OriginalPrice !== book.price && (
                                    <div className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 rounded-start">
                                        Sale
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-7 col-md-6">
                            <div className="d-flex flex-column h-100">
                                <div className="mb-3">
                                    <h1 className="display-5 fw-bold text-dark mb-2">{book.Title}</h1>
                                    <h5 className="text-muted mb-3">by {book.Author}</h5>
                                    
                                    <div className="d-flex align-items-center mb-3">
                                        {/* <div className="me-3">
                                            {renderStars(bookData.rating)}
                                        </div> */}
                                        {/* <span className="text-muted">({bookData.reviews} reviews)</span> */}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="h3 fw-bold text-primary me-3">₹ {book.Price}</span>
                                        {book.OriginalPrice !== book.Price && (
                                            <span className="h5 text-muted text-decoration-line-through"> ₹ {book.OriginalPrice}</span>
                                        )}
                                    </div>
                                    
                                    <div className="row g-3 mb-4">
                                        <div className="col-sm-6">
                                            <strong>Category:</strong> <span className="text-muted">{book.Category}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Condition:</strong> <span className="text-muted">{book.Condition}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Pages:</strong> <span className="text-muted">{book.Pages}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Publisher:</strong> <span className="text-muted">{book.Publisher}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Published:</strong> <span className="text-muted">{book.PublishedYear}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <strong>Stock:</strong> 
                                            <span className={`ms-2 badge ${book.Quantity>0 ? 'bg-success' : 'bg-danger'}`}>
                                                {book.Quantity >0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto">
                                    <div className="row g-3 mb-3">
                                        <div className="col-sm-6">
                                            <label className="form-label fw-semibold">Quantity:</label>
                                            <div className="input-group">
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <input 
                                                    type="number" 
                                                    className="form-control text-center" 
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                />
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => setQuantity(quantity + 1)}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-grid gap-2 d-md-flex">
                                        <button 
                                            className="btn btn-outline-primary btn-lg flex-fill"
                                            onClick={()=>{handleaddtocart()}}
                                            // disabled={!book.Quantity>0}
                                            
                                        >
                                            <i className="fas fa-shopping-cart me-2"></i>
                                            Add to Cart
                                        </button>
                                        <button 
                                            className="btn btn-primary btn-lg flex-fill"
                                            onClick={()=>{handlebuynow()}}
                                            // disabled={!book.Quantity>0}

                                        >
                                            <i className="fas fa-bolt me-2"></i>
                                            Buy Now
                                        </button>
                                    </div>
                                    
                                    <div className="d-flex justify-content-center mt-3 gap-3">
                                        <button className="btn btn-outline-secondary">
                                            <i className="far fa-heart me-1"></i> Wishlist
                                        </button>
                                        <button className="btn btn-outline-secondary">
                                            <i className="fas fa-share-alt me-1"></i> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-3 shadow-sm p-4 mb-5">
                        <ul className="nav nav-tabs border-0 mb-4">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'description' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Description
                                </button>
                            </li>
                            {/* <li className="nav-item">
                                <button 
                                    className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'reviews' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Reviews ({bookData.reviews})
                                </button>
                            </li> */}
                        </ul>

                        <div className="tab-content">
                            {activeTab === 'description' && (
                                <div className="tab-pane fade show active">
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <h4 className="mb-3">About this book</h4>
                                            <p className="lead text-muted lh-lg">{book.Description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'reviews' && (
                                <div className="tab-pane fade show active">
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <h4 className="mb-4">Customer Reviews</h4>
                                            
                                            {/* Sample Review */}
                                            <div className="border-bottom pb-4 mb-4">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="me-3">
                                                        {renderStars(5)}
                                                    </div>
                                                    <h6 className="mb-0">Amazing classic!</h6>
                                                </div>
                                                <small className="text-muted mb-2 d-block">by John D. - March 15, 2024</small>
                                                <p className="text-muted">This is truly one of the greatest American novels ever written. Fitzgerald's prose is beautiful and the story is both tragic and compelling.</p>
                                            </div>
                                            
                                            <div className="border-bottom pb-4 mb-4">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="me-3">
                                                        {renderStars(4)}
                                                    </div>
                                                    <h6 className="mb-0">Great read</h6>
                                                </div>
                                                <small className="text-muted mb-2 d-block">by Sarah M. - February 28, 2024</small>
                                                <p className="text-muted">Excellent book with beautiful language. The story captures the essence of the 1920s perfectly.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Similar Books Section */}
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h3 className="mb-4">You might also like</h3>
                        <div className="row g-4">
                            {similarBooks.map((book, index) => (
                                <div key={index} className="col-lg-4 col-md-6">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img 
                                            src={book.image} 
                                            className="card-img-top" 
                                            alt={book.title}
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="card-title">{book.title}</h6>
                                            <p className="card-text text-muted small mb-3">{book.author}</p>
                                            <button className="btn btn-outline-primary btn-sm mt-auto">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Show;