import React, { useState } from 'react'
import './Dial.css'

Math.clip = function(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const Dial = (props) => {
  const [xVal, setXVal] = useState(props.xVal);
  const [yVal, setYVal] = useState(props.yVal);
  const [style, setStyle] = useState(`radial-gradient(farthest-corner at ${props.xVal}px ${100-props.yVal}px,#f35 0%, #43e 100%)`)
  const startDrag = (e) => {
    e.preventDefault();
    const boundingRect = e.target.getBoundingClientRect();
    const pts = {
      x: boundingRect.left + boundingRect.width / 2,
      y: boundingRect.bottom + boundingRect.height / 2
    };
    let gradientStyle = {

    }
    console.log(`start drag left ${boundingRect.left} width ${boundingRect.width} bottom ${boundingRect.bottom} height ${boundingRect.height} top ${boundingRect.top}`)
    console.log(`start drag e.clientX ${e.clientX}, y ${e.clientY}`)
    const moveHandler = e => {
      let xVal = Math.clip(e.clientX, 0 ,100);//, e.clientY, pts);
      setXVal( xVal);
      let yVal = Math.clip(100-e.clientY, 0 ,100);//, e.clientY, pts);
      setYVal( yVal);
      setStyle(`radial-gradient(farthest-corner at ${xVal}px ${100-yVal}px,#f35 0%, #43e 100%)`)
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  }

  return (
    <div className="dial" onMouseDown={startDrag} style={{backgroundImage: style}}>
      <div>{xVal}, {yVal}</div>

    </div>
  )
}
export default Dial;