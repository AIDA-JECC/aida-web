import './AchivementDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState, useEffect } from 'react';
import { FiUpload } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { getAchievementData, addAchievement } from '../../ListOfFunctions';

const AchievementsDashboard = () => {
  const [achievementName, setAchievementName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const filtered = achievements.filter(item => new Date(item.date).getFullYear() === selectedYear);
    setFilteredAchievements(filtered);
  }, [achievements, selectedYear]);

  const fetchAchievements = async () => {
    const data = await getAchievementData();
    const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setAchievements(sorted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAchievement = {
      name: achievementName,
      description,
      date,
      img: imgPreview || ''
    };
    await addAchievement(newAchievement);
    fetchAchievements();
    setAchievementName('');
    setDescription('');
    setDate('');
    setSelectedFile(null);
    setImgPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleContentClick = () => {
    if (isSidebarExpanded) setIsSidebarExpanded(false);
  };

  const uniqueYears = [...new Set(achievements.map(item => new Date(item.date).getFullYear()))].sort((a, b) => a - b);

  return (
    <div className='mainDash'>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="containerAchievement" onClick={handleContentClick}>
        <h1>ACHIEVEMENTS</h1>

        <div className="flexcontents">
          <div className="achievementDashboard">
            <form className="form-container" onSubmit={handleSubmit}>
              <h1 className="form_header">Add Achievement</h1>
              <h2 className="form-subheader">Achievement Name</h2>
              <input
                type="text"
                className="form-inputPro"
                value={achievementName}
                onChange={(e) => setAchievementName(e.target.value)}
                placeholder="Enter achievement name"
                required
              />
              <h2 className="form-subheader">Date</h2>
              <input
                type="date"
                className="form-inputPro"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <h2 className="form-subheader">Description</h2>
              <div className="upload-section">
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter achievement details"
                  required
                />
                <label htmlFor="file-upload" className="upload-label">
                  {selectedFile ? selectedFile.name : <FiUpload className='uploadLogo' />}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <button type="submit" className="submit-button">
                Add Achievement
              </button>
            </form>
          </div>
        </div>

        <div className="selectPro" aria-label="Year selectors">
          <select
            className="yearSelectPro"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="mainContPro">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((item, index) => (
              <div className="subContPro" key={index}>
                <div className="img_sidePro">
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                  />
                </div>
                <div className="contentProjectDash">
                  <h1>{item.name}</h1>
                  <p>{item.description}</p>
                  <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No achievements found for {selectedYear}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsDashboard;
