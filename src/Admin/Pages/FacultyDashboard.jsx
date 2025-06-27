import './FacultyDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import Card from '../../components/Card';
import { FiUpload } from "react-icons/fi";
import { getFacultyData, addFacultyMember, updateFacultyMember, deleteFacultyMember } from '../../ListOfFunctions';
import { supabase } from '../../supabaseClient';

const FacultyDashboard = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedIn] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getFacultyData();
      setFacultyList(data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      showPopup('Failed to load faculty data.', 'error');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => setPopupMessage(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('faculty-photos')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from('faculty-photos')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const mailPhone = `mailto:${email}?cc=aida@jecc.ac.in`;
      const mailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&cc=aida@jecc.ac.in`;

      await addFacultyMember({
        name,
        designation: position,
        linkedin,
        pic: imageUrl || '',
        mailPhone,
        mailWeb
      });

      setName('');
      setPosition('');
      setEmail('');
      setLinkedIn('');
      setSelectedFile(null);

      fetchData();
      showPopup('Faculty added successfully. Refresh the site to view changes.', 'success');
    } catch (error) {
      console.error('Error adding faculty member:', error);
      showPopup(`Error adding faculty member. Please try again. ${error}`, 'error');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleContentClick = () => {
    if (isSidebarExpanded) setIsSidebarExpanded(false);
  };

  const editFaculty = (faculty) => {
    setEditingFaculty(faculty);
    setShowEditPopup(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        name: editingFaculty.name,
        designation: editingFaculty.designation,
        linkedin: editingFaculty.linkedin,
        mailPhone: editingFaculty.mailPhone,
        mailWeb: editingFaculty.mailWeb,
      };
      await updateFacultyMember(editingFaculty.id, updatedData);
      setShowEditPopup(false);
      fetchData();
      showPopup('Faculty updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating faculty:', error);
      showPopup('Error updating faculty. Please try again.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFacultyMember(editingFaculty.id);
      setShowEditPopup(false);
      fetchData();
      showPopup('Faculty deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      showPopup('Error deleting faculty. Please try again.', 'error');
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
            {facultyList.map((content) => (
              <div key={content.id} onClick={() => editFaculty(content)}>
                <Card
                  className='cardWhite'
                  img={content.pic}
                  name={content.name}
                  position={content.designation}
                  linkedin={content.linkedin}
                  mailPhone={content.mailPhone}
                  mailWeb={content.mailWeb}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditPopup && editingFaculty && (
        <div className="popup-form-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <p>Edit Faculty</p>
              <div className='formDetails'>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingFaculty.name}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Faculty Position"
                  value={editingFaculty.designation}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingFaculty.mailPhone?.split('mailto:')[1]?.split('?')[0] || ''}
                  onChange={(e) => {
                    const updatedEmail = e.target.value;
                    const mailPhone = `mailto:${updatedEmail}?cc=aida@jecc.ac.in`;
                    const mailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${updatedEmail}&cc=aida@jecc.ac.in`;
                    setEditingFaculty({ ...editingFaculty, mailPhone, mailWeb });
                  }} 
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={editingFaculty.linkedin}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, linkedin: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button type="submit">Update Faculty</button>
                <button type="button" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px' }}>
                  <FiTrash2 /> Delete
                </button>
              </div>
              <button type="button" onClick={() => setShowEditPopup(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className={`popup ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
