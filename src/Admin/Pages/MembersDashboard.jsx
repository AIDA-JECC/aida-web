import './MembersDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState,useEffect } from 'react'; 
import { IoMdAdd } from "react-icons/io";
import dataset from '../../components/content';
import { FiUpload } from "react-icons/fi";
const MembersDashboard = () => {
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

  const handleItemClick = () => {
    if (isSidebarExpanded) {
      setIsSidebarExpanded(false); // Collapse the sidebar when clicking on item
    }
  };
  const [year, setYear] = useState(2023);
  const [filteredData, setFilteredData] = useState(dataset);
  useEffect(() => {
    handleFilter('2024');
}, [dataset]);


  const uniqueYears = [...new Set(dataset.map(item => item.year))].sort((a, b) => a - b);

  const handleFilter = (selectedYear) => {
    setYear(selectedYear);
    const filtered = selectedYear ? dataset.filter(item => item.year.toString() === selectedYear) : dataset;
    setFilteredData(filtered);
  };

  
  return (
    <div className='mainDash'>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="ContainerMembers" onClick={handleItemClick}>
        <h1>Members</h1>
        <div className="flexitemsMember">
          
            <div className="members-dashboard">
            <form onSubmit={handleSubmit} className="memberForm">
                <p className="form-subheaderMember">New</p>

                <div>
                    <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <input
                    type="text"
                    placeholder="Member's Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
             
                <div>
                    <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={linkedin}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    required
                    />
                </div>
                <div className="upload-sectionMember">    
                    <label htmlFor="file-upload" className="upload-labelMember">
                    {selectedFile ? selectedFile.name : (
                        <>
                        <FiUpload className="uploadLogoMember" />
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

                <button type="submit" className="submit-buttonMember">Add Member</button>
            </form>

            </div>
        </div>
    
      <div className="yearMembers">
           <select className='btnMember' value={year} onChange={(e) => handleFilter(e.target.value)}>    
                 {uniqueYears.map(yr => (
                   <option key={yr} value={yr}>
                     {yr}
                   </option>  
                 ))}   
                
            </select>
      </div>
            <div className="memberDashCard">
            <div className="memberDashCardComp">
                {filteredData.map((item, index) => (
                <div className="memberCard" key={index}>
                    <div className="memberImg">
                    <img src={item.link} alt={item.name} />
                    </div>
                    <div className="memberContent">
                    <h1>{item.name}</h1>
                    <p>{item.role}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
      </div>
    </div>
  );
};

export default MembersDashboard;
