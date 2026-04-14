'use client';

import React, { useState, useEffect } from 'react';
import './coming-soon.css';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const target = new Date('April 30, 2026 00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;

      if (dist < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(dist / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        seconds: Math.floor((dist % (1000 * 60)) / 1000).toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coming-soon-wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="border-frame"></div>

      <div className="container">
        <p className="eyebrow">Launching April 2026</p>
        <h1 className="logo">EVENTSORA</h1>
        <p className="tagline">The art of unforgettable celebration.</p>

        <div className="countdown">
          <div className="time-block">
            <span className="time-value">{timeLeft.days}</span>
            <span className="time-label">Days</span>
          </div>
          <div className="time-block">
            <span className="time-value">{timeLeft.hours}</span>
            <span className="time-label">Hours</span>
          </div>
          <div className="time-block">
            <span className="time-value">{timeLeft.minutes}</span>
            <span className="time-label">Mins</span>
          </div>
          <div className="time-block">
            <span className="time-value">{timeLeft.seconds}</span>
            <span className="time-label">Secs</span>
          </div>
        </div>

        <div className="social-section">
          <a className="insta-link" href="https://instagram.com/areeb.startup" target="_blank" rel="noopener noreferrer">
            <svg className="insta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
            <span>FOLLOW THE JOURNEY</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
