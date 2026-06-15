import React from 'react'

export const metadata = {
  title: 'About'
}

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      
      <h1 className="text-3xl font-bold mb-6">About Eventsora</h1>

      <p className="mb-4 text-gray-700 leading-relaxed">
        Eventsora is a modern event planning platform designed to simplify how people 
        plan and manage events. Whether it’s a wedding, corporate gathering, birthday, 
        or even a casual picnic, Eventsora connects users with the right vendors in just a few clicks.
      </p>

      <p className="mb-4 text-gray-700 leading-relaxed">
        Our goal is to build a complete ecosystem where users can explore venues, catering, 
        photography, entertainment, and other essential services — all in one place — 
        without the usual hassle of searching and negotiating manually.
      </p>

      <p className="mb-4 text-gray-700 leading-relaxed">
        For service providers, Eventsora offers a powerful dashboard to manage bookings, 
        showcase services, handle schedules, and grow their business digitally. 
        We aim to give vendors the tools they need to stay organized and reach more customers.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        To become Pakistan’s leading event management platform by creating a seamless 
        and trusted environment for both customers and service providers.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
      <p className="text-gray-700 leading-relaxed">
        To simplify event planning by providing a centralized platform where users can 
        discover, compare, and book services efficiently, while empowering vendors 
        with digital tools to scale their business.
      </p>

    </div>
  )
}

export default About