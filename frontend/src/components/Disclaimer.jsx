import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { BACKEND_URL } from '../config';
import './Disclaimer.css';

const Disclaimer = ({ onClose }) => {
  const [user] = useAuthState(auth);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    try {
      if(!user) {
        //save disclaimer acceptance in local storage
        localStorage.setItem('disclaimerAccepted', 'true');
        onClose();
        return;
      }
      if (!accepted) {
        alert('Please accept the disclaimer before proceeding.');
        return;
      }
      const response = await fetch(BACKEND_URL + `api/user/disclaimer/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasAcceptedDisclaimer: true }),
      });
      if (response.ok) {
        onClose();
      } else {
        console.error('Error updating disclaimer acceptance:', response.statusText);
        alert('Error accepting disclaimer. Please try again later.');
      }
    } catch (error) {
      console.error('Error accepting disclaimer:', error);
      alert('Error accepting disclaimer. Please try again later.');
    }
  };

  return (
    <div className="disclaimer-modal">
      <div className="disclaimer-content">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <p className="disclaimer-text">
          By using Uniipal, you agree to our terms and conditions. 
          Please note that this website was made by the students, for the students and 
          Thapar Institute of Engineering and Technology is in no way responsible for any 
          of the purchases and exchanges taking place here.
        </p>
        <label className="disclaimer-checkbox">
          <input 
            type="checkbox" 
            checked={accepted} 
            onChange={() => setAccepted(!accepted)} 
          />
          <span>I have read and accept the disclaimer.</span>
        </label>
        <button 
          className="disclaimer-button" 
          onClick={handleAccept}
          disabled={!accepted} 
        >
          AGREE
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;