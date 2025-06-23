// src/Cards/Card.js
import React from 'react';
import './Card.css';
import link from './assets/linkedin.svg'
import mail from './assets/email.svg'

function Card(props) {
  return (
    <div className={`cards ${props.className}`}> {/* Apply className prop here */}
      <div className="profilePic">
        <img src={props.img} alt="Profile" className='cardImg'/>
      </div>
      <div className='Text'>
        <h4>{props.name}</h4>
        <h6>{props.position}</h6>
      </div>
    </div>
  );
}

export default Card;
