import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import React, { useState, useEffect } from "react";
import arrowdown from './assets/arrowdown.png';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { getAllMembers } from '../ListOfFunctions';
import './Members.css';

const Filter = () => {
  const [year, setYear] = useState('2024');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllMembers();
        const sortedData = data.sort((a, b) => a.pr - b.pr);
        setAllData(sortedData);
        const years = [...new Set(data.map(item => item.year.toString()))].sort((a, b) => a - b);
        setUniqueYears(years);
        const defaultYear = years[2];
        setYear(defaultYear);
        setFilteredData(sortedData.filter(item => item.year.toString() === defaultYear));
      } catch (err) {
        console.error("Failed to load members:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilter = (selectedYear) => {
    setYear(selectedYear);
    setFilteredData(allData.filter(item => item.year.toString() === selectedYear));
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
                480: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
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
