import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import React, { useState, useEffect, useMemo } from "react";
import dataset from './content';
import './Members.css';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow} from 'swiper/modules';

const Filter = () => {
  const [year, setYear] = useState(2024);
  const [filteredData, setFilteredData] = useState(() => {
    // Initialize with 2024 data
    return dataset.filter(item => item.year.toString() === '2024');
  });
  
  useEffect(() => {
    handleFilter('2024');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract unique years for the dropdown - memoized for performance
  const uniqueYears = useMemo(() => {
    return [...new Set(dataset.map(item => item.year))].sort((a, b) => b - a); // Sort descending (newest first)
  }, []);

  const handleFilter = (selectedYear) => {
    setYear(selectedYear);
    const filtered = selectedYear ? dataset.filter(item => item.year.toString() === selectedYear) : dataset;
    setFilteredData(filtered);
  };

  return (
    <div className="mainDiv">
     
     <select className='btn' value={year} onChange={(e) => handleFilter(e.target.value)}>
        {uniqueYears.map(yr => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    <Swiper
            initialSlide={Math.max(0, Math.floor(filteredData.length / 2) - 1)}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'3'}
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
              // pagination={true}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
              className="mySwiperM"
            >
              {filteredData.map((item, index) => (
                <SwiperSlide key={item.id || index}>
                  <div className="card">
                    <div className="card__image-container">
                      <img src={item.link} alt={`${item.name} - ${item.role}`} className="card__image" loading="lazy" />
                    </div>
                    <div className="card__content">
                      <h1 className="card__title">{item.name}</h1>
                      <p className="card__text">{item.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
    
    </div>
  );
};

export default Filter;