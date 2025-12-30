import React, { useState } from "react";
import "./eventspage.css";
import pic from "./assets/event.png"
import Header from "./Header";
import Popup from 'reactjs-popup';
import eventData from './description'
import Footer from "./Footer";
const events = eventData;

function EventsPage() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpen = () => {
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className={`events-page ${isPopupOpen ? 'blurred' : ''}`} id='events-page'>
      <Header />
      <div className="events-grid">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <Popup
              trigger={
                <img src={event.img} className="imageButton" alt={`Event: ${event.content.substring(0, 50)}...`} loading="lazy" />
              }
              modal
              closeOnDocumentClick
              overlayStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}

              onOpen={handleOpen}
              onClose={handleClose}
              className="reactjs-popup-overlay"
            >
              <div className="popup-container">
                <img
                  src={event.img}
                  alt="Event Image"
                  className="popup-image"
                />
                <div className="popup-content">
                  <h2>
                    About the Event
                  </h2>
                  <p>
                    {event.content}

                  </p>

                </div>
              </div>
            </Popup>
          </div>
        ))}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default EventsPage;
