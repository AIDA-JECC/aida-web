import './Header.css';
import pic from './assets/logo.png';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
function Header() {
    const [navActive, setNavActive] = useState(false);

    // Handle outside clicks to close the menu
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer && !navContainer.contains(event.target)) {
                setNavActive(false);
            }
        };

        // Close menu on scroll
        const handleScroll = () => setNavActive(false);

        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='HeadComp'>
            <header>
                <nav className="nav-container">
                    <Link to="/"><img src={'https://ik.imagekit.io/AIDA/Assets%20for%20Web/logo.png?updatedAt=1738262676780'} alt="Docplanner Group" className='image' /></Link>
                    <ul className={'navlist'}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <label
                            className='hamburger'
                            onClick={() => setNavActive(!navActive)}>
                            <svg style={{ paddingLeft: '10px' }} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 256 256">
                                <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
                            </svg>
                        </label>
                    </ul>
                </nav>
                <div id='nav_res' className={`${navActive ? 'nav-active' : 'nav-inactive'}`}>
                    <li className='list-item-active'><Link to="/" className='list-item'>Home</Link></li>
                    <li className='list-item-active'><Link to="/events" className='list-item'>Events</Link></li>
                    <li><Link to="/faculty" className='list-item'>Faculty</Link></li>
                    <li><Link to="/project" className='list-item'>Projects</Link></li>
                    <li><Link to="/verify" className='list-item'>Verify Certificate</Link></li>
                </div>
            </header>
             {/* <div className='login'>
                    <li><Link to="/login"> <FaRegUser/></Link></li>
             </div> */}
        </div>
    );
}

export default Header;