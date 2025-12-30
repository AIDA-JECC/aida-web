import "./Recent.css";
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Para from './Para';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import pic from './assets/event.png';

const content = [
  {
    img: pic,
    content: "Al Amthan R. M. (S6 AD), qualified from the South-West Zone Inter-University Karate Competition to represent APJAKTU in the All India Inter-University Karate Competition 2024-25 at Maharshi Dayanand University, Rohtak."
  },
  {
    img: pic,
    content: "Al Tejas R. M. (S6 AD), qualified from the South-West Zone Inter-University Karate Competition to represent APJAKTU in the All India Inter-University Karate Competition 2024-25 at Maharshi Dayanand University, Rohtak."
  },
  {
    img: pic,
    content: "Al Amthan R. M. (S6 AD), qualified from the South-West Zone Inter-University Karate Competition to represent APJAKTU in the All India Inter-University Karate Competition 2024-25 at Maharshi Dayanand University, Rohtak."
  },
  {
    img: pic,
    content: "Al Amthan R. M. (S6 AD), qualified from the South-West Zone Inter-University Karate Competition to represent APJAKTU in the All India Inter-University Karate Competition 2024-25 at Maharshi Dayanand University, Rohtak."
  }
]

function Recent() {
    return (
      <>
      <Para fontsize="30px" content="What's New ?" indexImg={10}></Para>
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
        {/* <SwiperSlide>
          <div className="slideR">
          <img className="eventImg" src={pic} alt="pic"></img>
          <div className="eventContent">
            <Para  indexImg={1} fontsize="22px" content="Al Amthan R. M. (S6 AD), qualified from the South-West Zone Inter-Uni-  versity Karate Competition to represent APJAKTU in the All India  Inter-University Karate Competition 2024-25 at Maharshi Dayanand Uni-  versity, Rohtak."/>
          </div>
          </div>
        </SwiperSlide> */}

        {content.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="slideR">
            <img className="eventImg" src={item.img} alt="Recent event" loading="lazy" />
            <div className="eventContent">
              <Para  indexImg={1} fontsize="22px" content={item.content}/>
            </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </>
    );
}

export default Recent;