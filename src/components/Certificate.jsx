import React, { useState, useEffect } from "react";
import pic from "./assets/chatbot.png";
import "./Certificate.css";
import Header from "./Header";
import Footer from "./Footer";

function Certificate() {
  const [input, setInput] = useState(""); // Stores user input
  const [data, setData] = useState([]); // Stores fetched data
  const [certificate, setCertificate] = useState(null); // Stores matched certificate
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data from the API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(
      "https://opensheet.elk.sh/1dN6rtexDUyVAU6Z5aJJP8K9cJrO_t8Nx_dkrY1D4hvQ/Consolidated%20Sheet"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch certificate data');
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Function to verify Certificate ID
  const verifyCertificate = () => {
    const matchedCert = data.find((cert) => cert["Certificate ID"] === input);
    setCertificate(matchedCert || "Not Found");
  };

  // Handle Enter key press
  const handleEnter = (event) => {
    if (event.key === "Enter") {
      verifyCertificate();
    }
  };

  return (
    <div className="certificate">
      <Header />
      <div className="img_mainText">
        <img src={pic} alt="img" />
        <div className="mainText">
          <h2>Verify Your Certificates Here!</h2>
        </div>
      </div>
      <div className="input_field">
        <input
          value={input}
          onKeyDown={handleEnter}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Enter Certificate Number"
          className="inputCerti"
          disabled={loading}
          aria-label="Certificate ID input"
        />
        <button onClick={verifyCertificate} disabled={loading}>
          {loading ? 'Loading...' : 'Verify'}
        </button>
      </div>

      {error && (
        <div className="result">
          <h3 className="notfound">Error: {error}</h3>
        </div>
      )}

      {certificate && (
        <div className="result">
          {certificate === "Not Found" ? (
            <h3 className="notfound">Certificate Not Found</h3>
          ) : (
            <div className="certificateCard">
              <h3>Certificate Details</h3>
              <p>
                <strong>Name : </strong>
                {certificate.Name}
              </p>
              <p><strong>Institution :</strong> {certificate.Institution}</p>
              <p><strong>Event Name :</strong> {certificate["Event Name"]}</p>
              <p><strong>Track :</strong> {certificate.Track}</p>
              <p><strong>Certificate Type :</strong> {certificate["Certificate Type"]}</p>
              <p><strong>Organized By :</strong> {certificate["Organized By"]}</p>
              <p><strong>Event Mode :</strong> {certificate["Event Mode"]}</p>
              <p><strong>Event Type :</strong> {certificate["Event Type"]}</p>
              {
                (certificate.Position === "") ? (
                  <></>
                ) : (
                  <p><strong>Position :</strong> {certificate.Position}</p>
                )
              }
              {
                (certificate.Date && certificate.Date !== "") ? (
                  <p><strong>Date :</strong> {certificate.Date}</p>
                ) : null
              }
            </div>
          )}
        </div>
      )}
      <Footer></Footer>
    </div>
  );
}

export default Certificate;
