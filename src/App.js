import './App.css';
import React, { useState } from 'react';
import Slider from './components/Slider';
function App() {
  const [level, setLevel] = useState(0);
  const volume = (event) => {
    console.log(event.target.value);
    setLevel(event.target.value);
  };
  const [bpm, setBpm] = useState(60);
  const tempo = (event) => {
    console.log(event.target.value);
    setBpm(event.target.value);
  };


  return (
    <div className='with-sidebar'>
      <div>
        <div className='controlbox'>
          <Slider
            onChange={volume}
            value={level}
            id="vol"
            name="vol"
            label="Volume"
            min={-20}
            max={20}
            step="0.1"
          ></Slider>
          <Slider
            onChange={tempo}
            value={bpm}
            id="bpm"
            name="bpm"
            label="BPM"
            min={1}
            max={200}
            step="1"
          ></Slider>
        </div>
        <div className='gridbox'>
          grid
        </div>
      </div>
    </div>
  );
}
export default App;
