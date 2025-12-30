import './EventDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { getEventData, addEvent, updateEvent, deleteEvent } from '../../ListOfFunctions';
import { supabase } from '../../supabaseClient';

const EventDashboard = () => {
  const [eventDetails, setEventDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getEventData();
      setEventList(data);
    } catch (error) {
      console.error('Error fetching event data:', error);
      showPopup('Failed to load event data.', 'error');
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
      let imageUrl = '';
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('event-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const eventObject = {
        content: eventDetails,
        img: imageUrl
      };

      await addEvent(eventObject);
      setEventDetails('');
      setSelectedFile(null);
      fetchData();
      showPopup('Event added successfully.', 'success');
    } catch (error) {
      console.error('Error adding event:', error);
      showPopup(`Error adding event. ${error.message || error}`, 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateEvent(editingEvent.id, {
        content: editingEvent.content
      });
      setShowEditPopup(false);
      fetchData();
      showPopup('Event updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating event:', error);
      showPopup('Error updating event. Please try again.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(editingEvent.id);
      setShowEditPopup(false);
      fetchData();
      showPopup('Event deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showPopup(`Error deleting event. ${error}`, 'error');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleContentClick = () => {
    if (isSidebarExpanded) setIsSidebarExpanded(false);
  };

  return (
    <div className="mainDash">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="ContainerEvent" onClick={handleContentClick}>
        <h1>EVENTS</h1>
        <div className="flexcontents">
          <div className="event-dashboard">
            <form onSubmit={handleSubmit}>
              <p>Add Event</p>
              <div className='formDetails'>
                <textarea
                  placeholder="Event Description"
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  required
                />
              </div>
              <div className="upload-sectionEvent">
                <label htmlFor="file-upload" className="upload-labelEvent">
                  {selectedFile ? selectedFile.name : (
                    <>
                      <FiUpload className="uploadLogoEvent" />
                      <span>Upload Image</span>
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
              <button type="submit">Add Event</button>
            </form>
          </div>
        </div>

        <div className="dashcontainer">
          <div className="dashcomponent">
            {eventList.map((event) => (
              <div className="dashevent-card" key={event.id} onClick={() => { setEditingEvent(event); setShowEditPopup(true); }}>
                <img src={event.img} alt="Event" className="dashimageButton" />
                <div className="dashevent-content">
                  <p>{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditPopup && editingEvent && (
        <div className="popup-form-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <p>Edit Event</p>
              <div className='formDetails'>
                <textarea
                  placeholder="Event Description"
                  value={editingEvent.content}
                  onChange={(e) => setEditingEvent({ ...editingEvent, content: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button type="submit">Update Event</button>
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

export default EventDashboard;
