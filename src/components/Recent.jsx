import "./Recent.css";
import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Para from './Para';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { supabase } from '../supabaseClient';

function Recent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentEvents() {
      try {
        const { data, error } = await supabase
          .from('whatsnew')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          throw error;
        }

        setContent(data);
      } catch (err) {
        console.error('Error fetching recent events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentEvents();
  }, []);

  if (loading) {
    return (
      <>
        <div className="recentHeading">
          <p>What's New ?</p>
        </div>
        <div className="loading">.</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="recentHeading">
          <p>What's New ?</p>
        </div>
        <div className="error">Error loading recent updates: {error}</div>
      </>
    );
  }

  return (
    <>
      <div className="recentHeading">
        <p>What's New ?</p>
      </div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiperR"
      >
        {content.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className="slideR">
              <img className="eventImg" src={item.img} alt="pic"></img>
              <div className="eventContent">
                <Para indexImg={1} fontsize="22px" content={item.content} />
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </>
  );
}

export default Recent;