import React, { useState } from 'react';
import './Project.css';
import Header from './Header';
import { AiFillGithub } from 'react-icons/ai';
import ProjectData from './projectData';
import Footer from './Footer';

function Project(props) {
  
  const [selectedYear,setSelectedYear] = useState(2023)
  const uniqueYears = [...new Set(ProjectData.map(project => project.year))];
  const filteredProjects = ProjectData.filter(project => project.year === selectedYear);

  return (
    <div>
      <Header />
       <div className="select-container" aria-label="Year selectors">
          <select
            className="year-select" 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))} 
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      <div className="mainCont">
       

        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div className= "subCont"  key={index}>
              <div className="img_side">
                <img src={project.img} alt={project.name} />
              </div>
              <div className="content">
                <h1>{project.name}</h1>
                <p>{project.detail}</p>
                <a href={project.gitLink} target="_blank" rel="noopener noreferrer">
                  <AiFillGithub className="git" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found for {selectedYear}.</p>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default Project;
