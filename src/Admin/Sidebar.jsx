import React from 'react';
import './Sidebar.css';
import { TfiDashboard } from "react-icons/tfi";
import { CiSettings } from "react-icons/ci";
import { MdEventAvailable } from "react-icons/md";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Sidebar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const content = [
    { label: 'Dashboard', icon: <TfiDashboard />, route: '/dashboard' },
    { label: 'Faculty', icon: <FaChalkboardTeacher />, route: '/facultydashboard' },
    { label: 'Project', icon: <GrProjects />, route: '/projectdashboard' },
    { label: 'Events', icon: <MdEventAvailable />, route: '/eventdashboard' },
    { label: 'Achievements', icon: <MdOutlineEmojiEvents />, route: '/achievementdashboard' },
    { label: 'Members', icon: <HiOutlineUsers />, route: '/memberdashboard' },
    { label: 'Settings', icon: <CiSettings />, route: '/settings' },
    { label: 'Logout', icon: <CiLogout />, route: '/logout' },
    { label: "Profile", icon: <FaCircleUser />, route: '/profile' }
  ];
  const profile=[{ label: "Profile", icon: <FaCircleUser />, route: '/profile' }];

  if (isMobile) {
    return (
      <>
      <div className="mobile-bottom-nav">
        {content.slice(0, 6).map((item, index) => (
          <Link 
            to={item.route}
            className={`mobile-nav-item ${window.location.pathname === item.route ? 'active-menu-item' : ''}`}
            key={index}
          >
            <div className="mobile-nav-icon">{item.icon}</div>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
       
        <div className="mobile-more-menu">
          {/* You can implement a dropdown for additional items */}
          <div className="mobile-nav-icon">•••</div>
          <span className="mobile-nav-label">More</span>
        </div>
      </div>
       <div className="mobile-nav-top">
          {profile.map((item,index) => (
               <Link 
            to={item.route}
            className={`mobile-top-item ${window.location.pathname === item.route ? 'active-menu-item' : ''}`}
            key={index}
          >
            <div className="mobile-top-icon">{item.icon}</div>
            {/* <span className="mobile-top-label">{item.label}</span> */}
          </Link>
          ))}
        </div>
      </>
      
    );

  }

  return (
    <div className="dashboard-containerSidebar">
      <div className="sidebar expanded">
        <div className="menuDashSide">
          <img src="https://ik.imagekit.io/AIDA/Assets%20for%20Web/AIDA%20LOGO%20THEMED.png?updatedAt=1697129861653" alt="img" className='aida_dashImg'/>
          {content.slice(0, 6).map((item, index) => (
            <Link 
              to={item.route}
              className={`menu-item ${window.location.pathname === item.route ? 'active-menu-item' : ''}`}
              key={index}
            > 
              <div className="menu-item-content">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="dashFooter">
          {content.slice(6).map((item, index) => (
            <Link 
              to={item.route}
              className={`dashFooter-item ${window.location.pathname === item.route ? 'active-menu-item' : ''}`}
              key={index}
            >
              <div className="dashFooter-item-content">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;