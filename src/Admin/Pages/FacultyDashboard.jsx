import './FacultyDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState } from 'react'; 
import { IoMdAdd } from "react-icons/io";
import Card from '../../components/Card';
import FacultyData from '../../components/FacultyData';
import { FiUpload } from "react-icons/fi";

const FacultyDashboard = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedIn] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, position, email, linkedin, photo });
  };

 
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleContentClick = () => {
    if (isSidebarExpanded) {
      setIsSidebarExpanded(false); // Collapse the sidebar when clicking on content
    }
  };

  
  return (
    <div className='mainDash'>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="Containerfaculty" onClick={handleContentClick}>
        <h1>FACULTY</h1>
        <div className="flexcontents">
        
            <div className="faculty-dashboard">
              <form onSubmit={handleSubmit}>
                <p>Add Faculty</p>
                <div className='formDetails'>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
             
                  <input
                    type="text"
                    placeholder="Faculty Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
               
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={linkedin}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    required
                  />
                </div>
                  <div className="upload-sectionFaculty">    
                    <label htmlFor="file-upload" className="upload-labelFaculty">
                    {selectedFile ? selectedFile.name : (
                        <>
                        <FiUpload className="uploadLogoFaculty" />
                        <span>Upload Photo</span>
                        </>
                    )}
                    </label>
                    <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    />
                  </div>
                <button type="submit">Add Faculty</button>
              </form>
            </div>
        
        </div>
        <div className="dashcontainer">
          <div className="dashcomponent">
            {FacultyData.map((content) => (
              <Card
                className='cardWhite'
                key={content.Id}
                img={content.pic}
                name={content.name}
                position={content.designation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
