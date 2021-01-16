import React, { useState } from 'react';

Math.clip = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
const BeatDial = (props) => {
  const width = 100;
  const height = 100;
  const [xVal, setXVal] = useState(0);
  const [yVal, setYVal] = useState(0);
  const [style, setStyle] = useState(`radial-gradient(farthest-corner at ${xVal}px ${height-yVal}px,#f35 0%, #43e 100%)`)
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
      console.log(`height ${height}, clientY ${e.clientY} top ${boundingRect.top} bottom ${boundingRect.bottom}`);
      console.log(`the val is ${e.clientY - boundingRect.top}`)
      let y = Math.clip(Math.round(e.clientY - boundingRect.top), 0, 100);//, e.clientY, pts);
      setYVal(100-y);
      setStyle(`radial-gradient(farthest-corner at ${x}px ${y}px,#f35 0%, #43e 100%)`)
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  }



  if (props.tick == props.i && yVal) {
    console.log(`${2000*(xVal/100)} and ${yVal}`)
    if(yVal > 0) {
      props.oscillator.frequency.setValueAtTime(100 * (yVal / 100), props.context.currentTime);
    }
    if(props.gain ) {
      props.gain.gain.setTargetAtTime(xVal / 100, props.context.currentTime, 0.01);
    }
  }


  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`} onMouseDown={startDrag} style={{backgroundImage: style, width:width+"px", height:height+"px"}}>
      <div>{xVal}, {yVal}</div>
    </div>
  )
}

export default BeatDial;