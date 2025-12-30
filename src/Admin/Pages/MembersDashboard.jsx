import './MembersDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { getAllMembers, addExecutiveMember } from '../../ListOfFunctions';

const MembersDashboard = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedIn] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [year, setYear] = useState(2024);
  const [allMembers, setAllMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterByYear(year);
  }, [allMembers, year]);

  const fetchMembers = async () => {
    const members = await getAllMembers();
    const sorted = members.sort((a, b) => a.pr - b.pr);
    setAllMembers(sorted);
  };


  const filterByYear = (selectedYear) => {
    const filtered = allMembers.filter(item => item.year === parseInt(selectedYear));
    setFilteredData(filtered);
  };

  const uniqueYears = [...new Set(allMembers.map(item => item.year))].sort((a, b) => a - b);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMember = {
      name,
      role: position,
      email,
      linkedin,
      year: year,
      link: photo || ''
    };
    await addExecutiveMember(newMember);
    fetchMembers();
    setName('');
    setPosition('');
    setEmail('');
    setLinkedIn('');
    setPhoto(null);
    setSelectedFile(null);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleItemClick = () => {
    if (isSidebarExpanded) setIsSidebarExpanded(false);
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
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" placeholder="Member's Position" value={position} onChange={(e) => setPosition(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedIn(e.target.value)} required />
              <div className="upload-sectionMember">
                <label htmlFor="file-upload" className="upload-labelMember">
                  {selectedFile ? selectedFile.name : (
                    <>
                      <FiUpload className="uploadLogoMember" />
                      <span>Upload Photo</span>
                    </>
                  )}
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </div>
              <button type="submit" className="submit-buttonMember">Add Member</button>
            </form>
          </div>
        </div>

        <div className="yearMembers">
          <select className='btnMember' value={year} onChange={(e) => setYear(e.target.value)}>
            {uniqueYears.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
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
