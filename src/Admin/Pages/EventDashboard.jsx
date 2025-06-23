import './EventDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FiUpload } from 'react-icons/fi';
import { FaLink } from 'react-icons/fa';
import eventData from '../../components/description';

const EventDashboard = () => {
  const [eventName, setEventName] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      eventName,
      eventLink,
      eventDetails,
      file: selectedFile,
    });

    // Clear form after submission
    setEventName('');
    setEventLink('');
    setEventDetails('');
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
        <h1>Events</h1>
        <div className="flexcontentsEvent">
          <div className="flexcontents">
            
              <div className="eventFormSection">
                <form
                  className="eventForm"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <h1 className="form_headerEvent">Add Event</h1>

                  <h2 className="form-subheaderEvent">Event Name</h2>
                  <input
                    type="text"
                    className="form-inputEvent"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    required
                  />

                  <h2 className="form-subheaderEvent">Event Link <FaLink className="gitLink" /></h2>
                  <input
                    type="url"
                    className="form-inputEvent"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    placeholder="Enter event link"
                    required
                  />

                  <h2 className="form-subheaderEvent">Event Details</h2>
                  <textarea
                    className="form-textarea"
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                    placeholder="Enter event description"
                    required
                  />

                  <div className="upload-sectionEvent">
                    <label htmlFor="file-upload" className="upload-labelEvent">
                      {selectedFile ? selectedFile.name : <FiUpload className="uploadLogoEvent" />}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>

                  <button type="submit" className="submit-buttonEvent">
                    Add Event
                  </button>
                </form>
              </div>
          </div>

          <div className="dashevents-grid">
            {eventData.map((event, index) => (
              <div className="dashevent-card" key={index}>
                <img src={event.img} alt="Event" className="dashimageButton" />
                <div className="dashevent-content">
                  <h3>{event.title}</h3>
                  <p>{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
