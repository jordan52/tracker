import React, { useState } from 'react';

Math.clip = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
const BeatDial = (props) => {
  const width = 100;
  const height = 100;
  const [xVal, setXVal] = useState(0);
  const [yVal, setYVal] = useState(0);
  const [style, setStyle] = useState(`radial-gradient(farthest-corner at ${props.xVal}px ${height-props.yVal}px,#f35 0%, #43e 100%)`)
  const startDrag = (e) => {
    e.preventDefault();
    const boundingRect = e.target.getBoundingClientRect();
    const pts = {
      x: boundingRect.left + boundingRect.width / 2,
      y: boundingRect.bottom + boundingRect.height / 2
    };
    let gradientStyle = {}
    const moveHandler = e => {
      let x = Math.clip(Math.round(e.clientX - boundingRect.left), 0, 100);//, e.clientY, pts);
      setXVal(x);
      let y = Math.clip(width - e.clientY - boundingRect.top, 0, 100);//, e.clientY, pts);
      setYVal(y);
      setStyle(`radial-gradient(farthest-corner at ${x}px ${height - y}px,#f35 0%, #43e 100%)`)
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  }



  if (props.tick == props.i && yVal) {
    console.log(`${2000*(xVal/100)} and ${yVal}`)
    //props.osc.oscillatorNode.frequency.setValueAtTime(2000*(xVal/100), props.context.currentTime)
    if(yVal > 0) {
      props.oscillator.frequency.setValueAtTime(2000 * (yVal / 100), props.context.currentTime);
    }
    if(props.gain ) {
      props.gain.gain.setTargetAtTime(xVal / 100, props.context.currentTime, 0.01);
    }
    //props.osc.oscillatorGainNode.gain.setTargetAtTime(0.9, props.context.currentTime, 0.01);
    //props.osc.oscillatorGainNode.gain.setTargetAtTime(0, props.context.currentTime, 1000);
  }


  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`} onMouseDown={startDrag} style={{backgroundImage: style, width:width+"px", height:height+"px"}}>
      <div>{xVal}, {yVal}</div>
    </div>
  )
}

export default BeatDial;