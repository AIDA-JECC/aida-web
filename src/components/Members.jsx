import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import React, { useState, useEffect } from "react";
import arrowdown from './assets/arrowdown.png'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { supabase } from '../supabaseClient';
import './Members.css';

const Filter = () => {
  const [year, setYear] = useState('2024'); // Initialize as string to match option values
  const [dataset, setDataset] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data: fetchedData, error } = await supabase
          .from('members')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.error(error);
        } else {
          setDataset(fetchedData || []);
          // Initialize with first year if available
          if (fetchedData && fetchedData.length > 0) {
            const years = [...new Set(fetchedData.map(item => item.year.toString()))];
            setYear(years[0] || '2024');
          }
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (dataset.length > 0) {
      handleFilter(year);
    }
  }, [dataset, year]);

  // Extract unique years for the dropdown
  const uniqueYears = [...new Set(dataset.map(item => item.year.toString()))].sort((a, b) => a - b);

  const handleFilter = (selectedYear) => {
    setYear(selectedYear);
    const filtered = dataset.filter(item => item.year.toString() === selectedYear);
    setFilteredData(filtered);
  };

  return (
    <div className="mainDiv">
      {loading ? (
        <div className="loading-message">Loading members...</div>
      ) : (
        <div className="filter-container">
          <div className="select-wrapper">
            <select 
              className='year-select' 
              value={year} 
              onChange={(e) => handleFilter(e.target.value)}
            >
              {uniqueYears.map(yr => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <img src={arrowdown} className='arrow-icon' alt="dropdown arrow" />
          </div>
          
          {filteredData.length > 0 ? (
            <Swiper
              initialSlide={Math.min(Math.floor(filteredData.length / 2), filteredData.length - 1)}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              breakpoints={{
                480: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              coverflowEffect={{
                rotate: 30,
                stretch: 4,
                depth: 300,
                modifier: 0.8,
                slideShadows: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
              className="members-swiper"
            >
              {filteredData.map((item, index) => (
                <SwiperSlide key={`${item.id}-${index}`}>
                  <div className="cardMembers">
                    <div className="cardMembers__image-container">
                      <img 
                        src={item.link || 'https://via.placeholder.com/150'} 
                        alt={item.name} 
                        className="cardMembers__image"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                    <div className="cardMembers__content">
                      <h2 className="cardMembers__title">{item.name}</h2>
                      <p className="cardMembers__text">{item.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="no-members">No members found for selected year</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;