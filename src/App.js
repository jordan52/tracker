import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Grid from './components/Grid';
import Slider from './components/Slider';

const useToggle = (initialState) => {
  const [isToggled, setIsToggled] = React.useState(initialState);

  // put [setIsToggled] into the useCallback's dependencies array
  // this value never changes so the callback is not going to be ever re-created
  const toggle = React.useCallback(
    () => setIsToggled(state => !state),
    [setIsToggled],
  );

  return [isToggled, toggle];
}

function App() {

  let timer = useRef(null);
  const [level, setLevel] = useState(0);
  const [tick, setTick] = useState(0);
  const [isPlaying, toggleIsPlaying] = useToggle(true);
  const volume = (event) => {
    setLevel(event.target.value);
  };
  const [bpm, setBpm] = useState(60);
  const tempo = (event) => {
    setBpm(event.target.value);
    if(isPlaying) {
      clearInterval(timer.current);
      play();
    }
  };

  const play = () => {
    timer.current = setInterval(()=>{
      setTick(tick=>{if(tick>14)return 0; return tick+1})
    },(60 * 1000) / bpm / 2);
    return () => clearInterval(timer.current);
  }
  useEffect(()=>{
    play();
  },[]);

  const playpause = () => {
    if(!isPlaying){
      play();
      toggleIsPlaying();
    } else {
      clearInterval(timer.current);
      toggleIsPlaying();
    }
  }
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
          <button onClick={()=>playpause()}>{isPlaying ? 'pause' : ' play  '}</button>
        </div>
        <Grid beats={16} tick={tick}/>
      </div>
    </div>
  );
}
export default App;
