// src/Component/Faculty.js
import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Faculty.css';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../supabaseClient';

function Faculty() {
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFacultyData() {
      try {
        const { data, error } = await supabase
          .from('facultydata')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        setFacultyData(data);
      } catch (err) {
        console.error('Error fetching faculty data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="component">
            Loading faculty data...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="component">
            Error loading faculty data: {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='container'>
        <div className="component">
          {facultyData.map(content => (
            <Card
              key={content.id || content.Id}
              img={content.pic}
              name={content.name}
              position={content.designation}
              link={content.link}
              mail={content.mail}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Faculty;