import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Audio from './Audio';
import Dial from './components/Dial';
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
  const [level, setLevel] = useState(50);
  const [tick, setTick] = useState(0);
  const [isPlaying, toggleIsPlaying] = useToggle(true);
  const volume = (event) => {
    Audio.masterGainNode.gain.setValueAtTime(parseInt(event.target.value)/100, Audio.context.currentTime)
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
      Audio.masterGainNode.gain.setValueAtTime(level/100, Audio.context.currentTime)
      play();
      toggleIsPlaying();
    } else {
      clearInterval(timer.current);
      Audio.masterGainNode.gain.setValueAtTime(0, Audio.context.currentTime)
      toggleIsPlaying();
    }
  }
  // https://levelup.gitconnected.com/the-web-is-alive-with-the-sound-of-react-bb0713aa1010
  const [oscillatorNodes, setOscillatorNodes] = useState([])
  const initializeMasterGain = () => {
    // Connect the masterGainNode to the audio context to allow it to output sound.
    Audio.masterGainNode.connect(Audio.context.destination)

    // Set masterGain Value
    Audio.masterGainNode.gain.setValueAtTime(level/100, Audio.context.currentTime)

    // create one single osc
    // Create a GainNode for the oscillator, set it to 0 volume and connect it to masterGainNode
    const oscillatorGainNode = Audio.context.createGain()
    oscillatorGainNode.gain.setValueAtTime(0.2, Audio.context.currentTime)
    oscillatorGainNode.connect(Audio.masterGainNode)

    // Create OscillatorNode, connect it to its GainNode, and make it start playing.
    const oscillatorNode = Audio.context.createOscillator()
    oscillatorNode.connect(oscillatorGainNode)
    oscillatorNode.start()

    // Store the nodes along with their values in state.
    // Note: When an oscillator is created, frequency is set to 440,
    // and type is set to 'sine' by default.
    const oscillatorNodeValues = {
      oscillatorNode: oscillatorNode,
      oscillatorGainNode: oscillatorGainNode,
      frequency: oscillatorNode.frequency.value,
      type: oscillatorNode.type,
      gain: 0
    }

    setOscillatorNodes([...oscillatorNodes, oscillatorNodeValues])
  }
  useEffect(initializeMasterGain, [])


  const knobtest = (v) => {
    console.log(`knobtest ${v}`)
  }
  return (
    <div>
      <Dial size={100} currentDeg={0} startAngle={5}/>
    </div>
  )
  /*
  return (
    <div className='with-sidebar' onChange={knobtest}>

      <div>

        <div className='controlbox'>
          <Slider
            onChange={volume}
            value={level}
            id="vol"
            name="vol"
            label="Volume"
            min={0}
            max={100}
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
        <Grid beats={16} tick={tick} osc={oscillatorNodes[0]} context={Audio.context} />
      </div>
    </div>
  );*/
}
export default App;
