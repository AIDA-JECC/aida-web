// src/Component/Faculty.js
import React from 'react';
import Card from './Card';
import './Faculty.css';
import dataset from './content'; 
import Header from './Header';
import Footer from './Footer';

function Faculty() {
  return (
    <>
    <Header />
    <div className='container'>
      <div className="component">
        {dataset.map(content => (
          <Card
          key={content.id}
          img={content.link} 
          name={content.name}
          position={content.role}
          />
        ))}
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}

export default Faculty;