import React, { useState } from 'react';

const Beat = (props) => {
  const [freq, setFreq] = useState(0);

  const handleFreqChange = (e) => {
    setFreq(e.target.value);
  }

  if(props.osc) {
    if (props.tick == props.i && freq > 0) {
      console.log(freq)
      props.osc.oscillatorNode.frequency.setValueAtTime(freq, props.context.currentTime)
      props.osc.oscillatorGainNode.gain.setValueAtTime(0.9, props.context.currentTime);
    } else {
      props.osc.oscillatorGainNode.gain.setValueAtTime(0.01, props.context.currentTime+100);
    }
  } else {
    console.log('NO OSC PROP')
  }

  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`}>
      <input className='beatinput' value={freq} onChange={handleFreqChange} />
    </div>
  )
}
export default Beat;