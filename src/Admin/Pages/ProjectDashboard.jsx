import './ProjectDashboard.css';
import Sidebar from '../Sidebar';
import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { getProjectData, addProject } from '../../ListOfFunctions';
import { supabase } from '../../supabaseClient';

const ProjectDashboard = () => {
  const [projectName, setProjectName] = useState('');
  const [gitLink, setGitLink] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => project.year === selectedYear);
    setFilteredProjects(filtered);
  }, [projects, selectedYear]);

  const fetchProjects = async () => {
    const data = await getProjectData();
    const sorted = data.sort((a, b) => a.year - b.year);
    setProjects(sorted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (!user || userError) {
      alert('You must be logged in to upload a project.');
      return;
    }

    let imageUrl = '';
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
        alert('Image upload failed.');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
      setUploadedImageUrl(imageUrl);
    }

    const newProject = {
      name: projectName,
      gitLink,
      detail: details,
      year: selectedYear,
      img: imageUrl
    };

    await addProject(newProject);
    fetchProjects();
    resetForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProjectName('');
    setGitLink('');
    setDetails('');
    setSelectedFile(null);
    setImgPreview(null);
    setUploadedImageUrl('');
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleContentClick = () => {
    if (isSidebarExpanded) setIsSidebarExpanded(false);
  };

  const uniqueYears = [...new Set(projects.map(project => project.year))].sort((a, b) => a - b);

  return (
    <div className='mainDash'>
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="containerProject" onClick={handleContentClick}>
        <h1>PROJECT</h1>

        <div className="flexcontents">
          <div className="projectDashboard">
            <form className="form-container" onSubmit={handleSubmit}>
              <h1 className="form_header">Add Projects</h1>
              <h2 className="form-subheader">Project Name</h2>
              <input
                type="text"
                className="form-inputPro"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
              <h2 className="form-subheader">Project Link<FaGithub className='gitLink' /></h2>
              <input
                type='url'
                className="form-inputPro"
                value={gitLink}
                onChange={(e) => setGitLink(e.target.value)}
                placeholder="Enter project link"
                required
              />
              <h2 className="form-subheader">Details</h2>
              <div className="upload-section">
                <textarea
                  className="form-textarea"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter project details"
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
                Add Project
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
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div className="subContPro" key={index}>
                <div className="img_sidePro">
                  <img
                    src={project.img}
                    alt={project.name}
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                  />
                </div>
                <div className="contentProjectDash">
                  <h1>{project.name}</h1>
                  <p>{project.detail}</p>
                  <a href={project.gitLink} target="_blank" rel="noopener noreferrer">
                    <FaGithub className='gitLink' />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found for {selectedYear}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
