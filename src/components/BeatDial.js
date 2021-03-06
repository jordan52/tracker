import React, { useState } from 'react';

Math.clip = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
const BeatDial = (props) => {
  const width = 100;
  const height = 100;
  const [xVal, setXVal] = useState(Math.round(props.freq/100));
  const [yVal, setYVal] = useState(Math.round(props.level*100));
  const [style, setStyle] = useState(`radial-gradient(farthest-corner at ${xVal}px ${height-yVal}px,#f35 0%, #43e 100%)`)
  const updateVals = (e) => {
    e.preventDefault();
    props.updateBeat(props.i, props.track, xVal/100, 1000 * (yVal / 100));
  }
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
  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`} onMouseDown={startDrag} onMouseUp={updateVals} style={{backgroundImage: style, width:width+"px", height:height+"px"}}>
        <div>{xVal},{yVal}</div>
    </div>
  )
}

export default BeatDial;