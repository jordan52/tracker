import React, { useState } from 'react';
import Knob from './Knob';
const Beat = (props) => {
  const [freq, setFreq] = useState(0);

  const handleTextFreqChange = (e) => {
    setFreq(e.target.value);
    //setFreq(e);
    console.log('freq is ' + e)
  }
  const handleFreqChange = (e) => {
    setFreq(e);
    console.log('freq is ' + e)
  }


  if(props.osc) {
    if (props.tick == props.i && freq > 0) {
      console.log(freq)
      props.osc.oscillatorNode.frequency.setValueAtTime(freq, props.context.currentTime)
      props.osc.oscillatorGainNode.gain.setValueAtTime(0.9, props.context.currentTime);
    } else {
      props.osc.oscillatorGainNode.gain.setValueAtTime(0.0, props.context.currentTime);
    }
  }

  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`}>
      <input className='beatinput' value={freq} onChange={handleTextFreqChange} />

    </div>
  )
}
export default Beat;