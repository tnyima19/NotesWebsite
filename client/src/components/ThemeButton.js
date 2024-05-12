import React, { useState, useEffect } from 'react';
import haikyuuImg from '../pages/haikyuu-2.jpg';
import demonImg from '../pages/demonslayer.jpg';
import animeImg from '../pages/anime-1.png';
import roomImg from '../pages/animeroom.png';
import whiteImg from '../pages/white.png';

function ThemeButton() {

  // State hooks to manage the visibility of theme options and the selected theme
  const [showThemeOptions, setShowThemeOptions] = useState(false); //is a boolean state variable that controls the visibility of the theme options dropdown.
  //selectedTheme stores the currently selected theme. 
  //It initializes with the value retrieved from localStorage, 
  //defaulting to 'white' if no theme is saved in localStorage.
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'white'); // Load the selected theme from localStorage

  const toggleThemeOptions = () => {
    setShowThemeOptions(!showThemeOptions);
  };

  //It changes the background image of the body, updates the 
  //selected theme in state and localStorage, and hides the theme options dropdown.
  const setHaikyuuTheme = () => {
    document.body.style.backgroundImage = `url(${haikyuuImg})`;
    localStorage.setItem('selectedTheme', 'haikyuu'); // Save the selected theme to localStorage
    setSelectedTheme('haikyuu');
    setShowThemeOptions(false);
  };

  const setDemonSlayerTheme = () => {
    document.body.style.backgroundImage = `url(${demonImg})`;
    localStorage.setItem('selectedTheme', 'demonSlayer');
    setSelectedTheme('demonSlayer');
    setShowThemeOptions(false);
  };

  const setAnimeTheme = () => {
    document.body.style.backgroundImage = `url(${animeImg})`;
    localStorage.setItem('selectedTheme', 'anime');
    setSelectedTheme('anime');
    setShowThemeOptions(false);
  };

  const setRoomTheme = () => {
    document.body.style.backgroundImage = `url(${roomImg})`;
    localStorage.setItem('selectedTheme', 'room');
    setSelectedTheme('room');
    setShowThemeOptions(false);
  };

  const setDefaultTheme = () => {
    document.body.style.backgroundImage = `url(${whiteImg})`;
    localStorage.setItem('selectedTheme', 'white');
    setSelectedTheme('white');
    setShowThemeOptions(false);
  };

/*The useEffect hook is used to apply the selected theme when the 
component mounts (i.e., when it is first rendered).
It runs the theme-setting function (setHaikyuuTheme, setDemonSlayerTheme, etc.) 
based on the initially selected theme stored in selectedTheme.
The empty dependency array ([]) ensures that this effect runs only once, when the component mounts.
*/

  useEffect(() => {
    // Set the background theme when the component mounts
    switch (selectedTheme) {
      case 'haikyuu':
        setHaikyuuTheme();
        break;
      case 'demonSlayer':
        setDemonSlayerTheme();
        break;
      case 'anime':
        setAnimeTheme();
        break;
      case 'room':
        setRoomTheme();
        break;
      case 'white':
        setDefaultTheme();
        break;
      default:
        setDefaultTheme();
    }
  }, []); // Run this effect only once, when the component mounts

  return (
    <div className="theme-options-dropdown">
      <button className="theme-options-btn" onClick={toggleThemeOptions}>Theme</button>
      {showThemeOptions && (
        <div className="theme-options-list">
          <div className="theme-option" onClick={setHaikyuuTheme}>
            Haikyuu
          </div>
          <div className="theme-option" onClick={setDemonSlayerTheme}>
            Demon Slayer
          </div>
          <div className="theme-option" onClick={setAnimeTheme}>
            Totoro
          </div>
          <div className="theme-option" onClick={setRoomTheme}>
            Anime Room
          </div>
          <div className="theme-option" onClick={setDefaultTheme}>
            No theme
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeButton;


/*

In the context of React, "mounting" refers to the process of creating an 
instance of a component and inserting it into the DOM (Document Object Model). 
When a component is mounted, it means that it is being initialized and rendered for the first time.
*/ 