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
  const [tracks, setTracks] = useState(4);
  let timer = useRef(null);
  const [beats, setBeats] = useState(8);
  const [level, setLevel] = useState(10);
  const [pan, setPan] = useState([-1,1,0,0]);
  const [trackLevels, setTrackLevels] = useState([100,0,0,0]);
  const [trackTypes, setTrackTypes] = useState(['sawtooth','sine']);
  const [tick, setTick] = useState(0);
  const [isPlaying, toggleIsPlaying] = useToggle(false);
  const [bpm, setBpm] = useState(160);
  const [oscillator, setOscillator] = useState();
  const [gainNode, setGainNode] = useState();
  const [panNode, setPanNode] = useState();
  const [oscillators, setOscillators] = useState([]);
  const [beatLevels, setBeatLevels] = useState([[0.33, 0.2, 0.29, 0.19, 0.31, 0.36, 0.38, 0.49],[0.10, 0.10, 0.22, 0.22, 0.33, 0.33, 0.55, 0.55],[0.10, 0.10, 0.22, 0.22, 0.33, 0.33, 0.55, 0.55],[0.10, 0.10, 0.22, 0.22, 0.33, 0.33, 0.55, 0.55]]);
  const [beatFreqs, setBeatFreqs] = useState([[220, 250, 360, 330, 440, 410, 370, 370],[440, 440, 220, 220, 110, 110, 70, 70],[440, 440, 220, 220, 110, 110, 70, 70],[440, 440, 220, 220, 110, 110, 70, 70]]);

  const volume = (event) => {
    Audio.masterGainNode.gain.setValueAtTime(parseInt(event.target.value)/100, Audio.context.currentTime)
    setLevel(event.target.value);
    console.log(`master gain node value: ${Audio.masterGainNode.gain.value}`);
  };
  const tempo = (event) => {
    setBpm(event.target.value);
    if(isPlaying) {
      clearInterval(timer.current);
      play();
    }
  };
  const removeTrack = (event, track) =>{
    console.log(`removing track ${track}`);
    setPan(pan => pan.filter((x, i) => i !== track));
    setTrackLevels(trackLevels => trackLevels.filter((x, i) => i !== track));
    setTrackTypes(trackTypes => trackTypes.filter((x, i) => i !== track));
    oscillators[track].oscillatorNode.stop();
    oscillators[track].panNode.disconnect();
    oscillators[track].oscillatorGainNode.disconnect();
    oscillators[track].oscillatorTrackGainNode.disconnect();
    setOscillators(oscillators => oscillators.filter((x, i) => i !== track));
    setBeatLevels(beatLevels => beatLevels.filter((x, i) => i !== track));
    setBeatFreqs(beatFreqs => beatFreqs.filter((x, i) => i !== track));
    setTracks(tracks-1);
  }
  const addTrack = (event)=>{
    const track = tracks;
    const p = [...pan];
    p[track] = 0;
    setPan(p );

    const t = [...trackLevels];
    t[track] = 0;
    setTrackLevels(t);

    const type = [...trackTypes];
    type[track] = 'sine';
    setTrackTypes(type);

    const oscillatorTrackGainNode = Audio.context.createGain()
    oscillatorTrackGainNode.gain.setValueAtTime(0.01, Audio.context.currentTime)
    oscillatorTrackGainNode.connect(Audio.masterGainNode)

    const oscillatorGainNode = Audio.context.createGain()
    oscillatorGainNode.gain.setValueAtTime(0.01, Audio.context.currentTime)
    oscillatorGainNode.connect(oscillatorTrackGainNode)

    const panNode = Audio.context.createStereoPanner();
    panNode.pan.value = 0;
    panNode.connect(oscillatorGainNode);

    const oscillatorNode = Audio.context.createOscillator()
    oscillatorNode.connect(panNode)
    oscillatorNode.type = 'sine';
    oscillatorNode.start();

    setOscillator(oscillatorNode);
    setGainNode(oscillatorGainNode);
    setPanNode(panNode);
    const nodeStruct = {
      oscillatorNode,
      panNode,
      oscillatorGainNode,
      oscillatorTrackGainNode
    }

    setOscillators([...oscillators, nodeStruct]);

    // copy each existing track and add a new one to the end
    for(var i = 0;i<track;i++) {
      let newLevels = [...beatLevels];
      setBeatLevels([...newLevels, [1,1,1,1,1,1,1,1]]);

      let newFreqs = [...beatFreqs];
      setBeatFreqs([...newFreqs, [440,440,440,440,440,440,440,440]]);
    }
    setTracks(tracks+1);
  };
  const changePan = (event, track) => {
    oscillators[track].panNode.pan.value = event.target.value;
    const p = [...pan];
    p[track] = event.target.value;
    setPan(p );
  }
  const changeTrackLevel = (event, track) => {
    console.log(`Changing Track level ${track} ${event.target.value}`)
    oscillators[track].oscillatorTrackGainNode.gain.setValueAtTime(parseInt(event.target.value)/100, Audio.context.currentTime)
    const p = [...trackLevels];
    p[track] = parseInt(event.target.value);
    setTrackLevels(p);
  }
  const changeTrackType = (event, track) => {
    console.log(`changing track type ${event.target.value} ${track}`);
    oscillators[track].oscillatorNode.type = event.target.value;
    const t = [...trackTypes];
    t[track] = event.target.value;
    setTrackTypes(t);
  }
  const updateBeat = (tick, track, volume, frequency) => {
    console.log(`updatingbeat ${tick}, ${volume}, ${frequency} `)
    let newLevels = [...beatLevels];
    newLevels[track][tick] = volume;
    setBeatLevels(newLevels);

    let newFreqs = [...beatFreqs];
    newFreqs[track][tick] = frequency;
    setBeatFreqs(newFreqs);
  };

  const play = () => {
    timer.current = setInterval(()=>{
      setTick(tick=>{if(tick>beats-2)return 0; return tick+1})
    },(60 * 1000) / bpm / 2);
    return () => clearInterval(timer.current);
  }
  const playpause = () => {
    if(!isPlaying){
      Audio.context.resume();
      Audio.masterGainNode.gain.setValueAtTime(level/100, Audio.context.currentTime)
      play();
      toggleIsPlaying();
    } else {
      clearInterval(timer.current);
      Audio.masterGainNode.gain.setValueAtTime(0, Audio.context.currentTime)
      toggleIsPlaying();
    }
  }
  const initializeMasterGain = () => {
    Audio.masterGainNode.connect(Audio.context.destination)
    Audio.masterGainNode.gain.setValueAtTime(level/100, Audio.context.currentTime)
    var o = []
    for(let i = 0; i < tracks;i++){

      const oscillatorTrackGainNode = Audio.context.createGain()
      oscillatorTrackGainNode.gain.setValueAtTime(trackLevels[i]/100, Audio.context.currentTime)
      oscillatorTrackGainNode.connect(Audio.masterGainNode)

      const oscillatorGainNode = Audio.context.createGain()
      oscillatorGainNode.gain.setValueAtTime(0, Audio.context.currentTime)
      oscillatorGainNode.connect(oscillatorTrackGainNode)

      const panNode = Audio.context.createStereoPanner();
      panNode.pan.value = pan[i];
      panNode.connect(oscillatorGainNode);

      const oscillatorNode = Audio.context.createOscillator()
      oscillatorNode.connect(panNode)
      oscillatorNode.type = 'square';
      oscillatorNode.start();

      setOscillator(oscillatorNode);
      setGainNode(oscillatorGainNode);
      setPanNode(panNode);
      const nodeStruct = {
        oscillatorNode,
        panNode,
        oscillatorGainNode,
        oscillatorTrackGainNode
      }
      o[i] = nodeStruct

    }
    setOscillators([...oscillators, ...o]);
  }

  useEffect(initializeMasterGain, [])

  // play tones
  useEffect(() => {
    if(oscillator && gainNode) {
      for(var i = 0; i<tracks;i++) {
        oscillators[i].oscillatorNode.frequency.setValueAtTime(beatFreqs[i][tick], Audio.context.currentTime);
        oscillators[i].oscillatorGainNode.gain.setTargetAtTime(beatLevels[i][tick], Audio.context.currentTime, 0.01);
      }
    }
  },[tick])

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

          <button onClick={()=>playpause()}>{isPlaying ? 'pause' : ' play  '}</button><button className="leftMargin" onClick={addTrack}>+ track</button>
        </div>
        <Grid tracks={tracks} beats={beats} tick={tick} beatLevels={beatLevels} beatFreqs={beatFreqs} updateBeat={updateBeat} pan={pan} changePan={changePan} trackLevels={trackLevels} changeTrackLevel={changeTrackLevel} trackTypes={trackTypes} changeTrackType={changeTrackType} removeTrack={removeTrack}/>

      </div>
    </div>
  );
};
export default App;
