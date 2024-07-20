import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TeamMember1Img from "../assets/chaitanya.jpg";
import TeamMember2Img from "../assets/jayani.jpg";
import TeamMember3Img from "../assets/astik.jpg";
import TeamMember4Img from "../assets/Japleen.jpg";
import MissionImage from "../assets/image2.jpg";
import AgendaImage from "../assets/image1.jpg";
import ValuesImage from "../assets/image3.jpg";
import OurStoryImage from "../assets/image4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./About.css";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="hero">
        <div className="hero-text">
          <h1>About <span className="highlight">UniiPal</span></h1>
          <p>
          UniiPal is a student-centric marketplace dedicated to fostering sustainability and affordability across college campuses worldwide. Our platform empowers students to effortlessly buy and sell second-hand items, creating meaningful connections and opportunities within their communities. Join us in building a more sustainable future for student life.
          </p>
        </div>
      </div>
      
      
      <div className="info-section">
        <div className="info-content">
          <h2>Mission</h2>
          <img src={MissionImage} alt="Mission" className="section-image" />
          <p>
            At UniiPal, our mission is to foster a sustainable and affordable community for students worldwide. We aim to create a platform where students can buy and sell gently used products, promoting a culture of reuse and responsible consumption.
          </p>
        </div>
      </div>
      
      <div className="info-section dark">
        <div className="info-content">
          <h2>Agenda</h2>
          <img src={AgendaImage} alt="Agenda" className="section-image" />
          <ul>
            <li>Promote Sustainability: Encourage the reuse of items to reduce waste and environmental impact.</li>
            <li>Facilitate Affordability: Provide students with access to quality products at student-friendly prices.</li>
            <li>Build Community: Create a trusted space for students to connect and support each other through buying and selling.</li>
          </ul>
        </div>
      </div>
      

      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <img src={TeamMember1Img} alt="Team Member 1" className="team-member-img" />
            <div className="team-member-info">
              <h4>Chaitanya Jayant</h4>
              <div className="social-links">
                <a href="https://github.com/ChaiiShree " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/chaitanyajayant/ " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
                <a href="https://www.instagram.com/chaitanya_jayant/ " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="team-card">
            <img src={TeamMember2Img} alt="Team Member 2" className="team-member-img" />
            <div className="team-member-info">
              <h4>Jayani Malik</h4>
              <div className="social-links">
                <a href="https://github.com/jayanimalik" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/jayani-malik/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
                <a href="https://www.instagram.com/jayanimalik/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="team-card">
            <img src={TeamMember3Img} alt="Team Member 3" className="team-member-img" />
            <div className="team-member-info">
              <h4>Astik Thukral</h4>
              <div className="social-links">
                <a href="https://github.com/astikthukral" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/astik-thukral/ " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
                <a href="https://www.instagram.com/astikthukral/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="team-card">
            <img src={TeamMember4Img} alt="Team Member 4" className="team-member-img" />
            <div className="team-member-info">
              <h4>Japleen Kaur</h4>
              <div className="social-links">
                <a href="https://github.com/JapleenKaur3" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} className="social-icon" /></a>
                <a href=" https://www.linkedin.com/in/japleen-kaur-46720724a/ " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
                <a href="https://www.instagram.com/__japleenkaur/ " target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <div className="info-content">
          <h2>Values</h2>
          <img src={ValuesImage} alt="Values" className="section-image" />
          <ul>
            <li>Community: We believe in the power of college communities and strive to strengthen them through our platform.</li>
            <li>Sustainability: We are committed to reducing waste and promoting eco-friendly practices.</li>
            <li>Affordability: We ensure that all prices are fair and affordable for students.</li>
            <li>Trust: We prioritize creating a safe and trustworthy environment for all our users.</li>
          </ul>
        </div>
      </div>
      
      <div className="info-section dark">
        <div className="info-content">
          <h2>Our Story</h2>
          <img src={OurStoryImage} alt="Our Story" className="section-image" />
          <p>
            UniiPal is a dedicated platform designed for college students worldwide. Our platform allows students to post and purchase gently used products, making it easier to find affordable and sustainable options right within their campus communities. Whether you're looking to sell your textbooks after a semester, find a second-hand laptop, or buy affordable hostel essentials, UniiPal is here to help.
          </p>
          <p>
            We started UniiPal with the vision of making campus life more sustainable and budget-friendly. By enabling students to buy and sell within their own communities, we not only help save money but also reduce the environmental footprint of campuses. Our user-friendly interface ensures that posting an item or finding what you need is simple and hassle-free.
          </p>
          <p>
            Join us in building a greener, more connected, and supportive college community. Together, we can make a difference—one transaction at a time.
          </p>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default About;
