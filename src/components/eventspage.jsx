import React, { useState, useEffect } from "react";
import "./eventspage.css";
import Header from "./Header";
import Popup from "reactjs-popup";
import Footer from "./Footer";
import { getEventData } from "../ListOfFunctions"; // Adjust path if needed

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    document.getElementById("events-page").style.filter = "blur(8px)";
  };

  const handleClose = () => {
    document.getElementById("events-page").style.filter = "blur(0px)";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventData();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page" id="events-page">
      <Header />
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div className="event-card" key={index}>
              <Popup
                trigger={<img src={event.img} className="eventimageButton" />}
                modal
                closeOnDocumentClick
                overlayStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onOpen={handleOpen}
                onClose={handleClose}
                className="reactjs-popup-overlay"
              >
                {(close) => (
                  <div className="popup-container">
                    <button className="eventpopup-close" onClick={close}>
                      ✖
                    </button>
                    <img src={event.img} alt="Event" className="popup-image" />
                    <div className="popup-content">
                      <h2>About the Event</h2>
                      <p>{event.content}</p>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default EventsPage;
