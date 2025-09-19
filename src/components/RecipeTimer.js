import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaPlus, FaMinus } from 'react-icons/fa';

const RecipeTimer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [presetTimers, setPresetTimers] = useState([
    { name: 'Quick Timer', minutes: 5, seconds: 0 },
    { name: 'Boiling Eggs', minutes: 7, seconds: 0 },
    { name: 'Pasta', minutes: 10, seconds: 0 },
    { name: 'Rice', minutes: 20, seconds: 0 }
  ]);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            // Play sound alert
            const audio = new Audio('/timer-sound.mp3');
            audio.play().catch(e => console.log('Audio play error:', e));
            return;
          }
          setMinutes(minutes => minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
    } else if (!isActive && (seconds !== 0 || minutes !== 0)) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(0);
    setSeconds(0);
  };

  const increaseMinute = () => {
    setMinutes(minutes => minutes + 1);
  };

  const decreaseMinute = () => {
    if (minutes > 0) {
      setMinutes(minutes => minutes - 1);
    }
  };

  const setPresetTimer = (minutes, seconds) => {
    setIsActive(false);
    setMinutes(minutes);
    setSeconds(seconds);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Cooking Timer</h2>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-mono font-bold mb-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className="flex justify-center items-center gap-3 mb-4">
          <button 
            onClick={decreaseMinute}
            className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300"
            disabled={isActive}
          >
            <FaMinus />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? <FaPause /> : <FaPlay />}
          </button>
          
          <button 
            onClick={increaseMinute}
            className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300"
            disabled={isActive}
          >
            <FaPlus />
          </button>
        </div>
        
        <button 
          onClick={resetTimer}
          className="flex items-center justify-center mx-auto px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          <FaRedo className="mr-2" />
          Reset
        </button>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Quick Timers</h3>
        <div className="grid grid-cols-2 gap-2">
          {presetTimers.map((timer, index) => (
            <button 
              key={index}
              onClick={() => setPresetTimer(timer.minutes, timer.seconds)}
              className="px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
            >
              {timer.name}: {timer.minutes}:{String(timer.seconds).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeTimer;
