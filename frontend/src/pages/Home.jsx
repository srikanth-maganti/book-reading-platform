import React from "react"
import {useRef,useEffect,useState} from 'react'
import "../assets/Home.css"
import { ChevronLeftIcon,ChevronRightIcon } from "lucide-react";
function Home()
{
  const sliderRef = useRef(null);
  const [trendingbooks,settrendingbooks]=useState([]);
  const scrollAmount = 100; 
  const [images, setImages] = useState([]);
  useEffect(()=>{
        const fetchdata=async()=>{
        const response=await fetch("http://localhost:3000/books/trending");

        if(response.ok)
        {
            const data=await response.json();
            settrendingbooks(data);
        }
        
    }
    fetchdata();
  })
  
    return(
        <div className ="home-content w-100">
            <div>
                <img src="/images/pic2.jpg" alt="?" className="home-img"/>
                <div className="arrows">
                    <div className="left"><i className="fa-solid fa-chevron-left"></i></div>
                    <div className="right"><i className="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>
            { trendingbooks.length>1 &&
            <div className="App">
                {/* Left navigation button */}
                <button
                    className="nav-btn"
                    onClick={() => {
                    const container = sliderRef.current;
                    container.scrollLeft -= scrollAmount; // Scroll left by the specified amount
                    }}
                >
                    <ChevronLeftIcon />
                </button>
                {/* Image container */}
                <div className="books-grid-container" ref={sliderRef}>
                    {trendingbooks.map((data) => <BookCard key={data._id} book={data} />)}
                </div>


                {/* Right navigation button */}
                <button
                    className="nav-btn"
                    onClick={() => {
                    const container = sliderRef.current;
                    container.scrollLeft += scrollAmount; // Scroll right by the specified amount
                    }}
                >
                    <ChevronRightIcon />
                </button>
            </div>
            }

            <div className="quote">
                <div className="quote-img">
                    <img src="/images/girl.jpg" alt=""/>
                </div>
                <div className="quote-content">
                    <blockquote className="quote-text">
                        "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                        <footer className="quote-author">
                            - George R.R. Martin
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}

export default Home
    