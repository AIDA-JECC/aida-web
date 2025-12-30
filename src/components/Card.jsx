// src/Cards/Card.js
import React from 'react';
import './Card.css';
import link from './assets/linkedin.svg'
import mail from './assets/email.svg'

function Card(props) {
  return (
    <div className="cards">
      <div className="profilePic">
        <img src={props.img} alt={`${props.name || 'Profile'} - ${props.position || ''}`} loading="lazy" />
      </div>
      <div className='Text'>
        <h4>{props.name}</h4> {/* Use 'name' instead of 'Name' to match props */}
        <h6>{props.position}</h6> {/* Use 'position' instead of 'Position' to match props */}
        <div className='links'>
          <a href={props.linkedin}>
            <img className='linkedin' src={link}/>
          </a>
          <a href={props.mailWeb}>
            <img className='emailWeb' src={mail}/>
          </a>
          <a href={props.mailPhone}>
            <img className='emailPhone' src={mail}/>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;