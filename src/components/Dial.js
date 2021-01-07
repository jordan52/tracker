import React, { useState } from 'react'
import './Dial.css'
const Dial = (props) => {
  const [deg, setDeg] = useState(props.deg)
  var margin = props.size * 0.15;


  let kStyle = {
    width: props.size,
    height: props.size
  };
  let iStyle = JSON.parse(JSON.stringify(kStyle));;
  let oStyle = JSON.parse(JSON.stringify(kStyle));;
  oStyle.margin = margin;
  if (props.color) {
    oStyle.backgroundImage =
      "radial-gradient(100% 70%,hsl(210, " +
      this.currentDeg +
      "%, " +
      this.currentDeg / 5 +
      "%),hsl(" +
      Math.random() * 100 +
      ",20%," +
      this.currentDeg / 36 +
      "%))";
  }
  iStyle.transform = "rotate(" + deg + "deg)";

  const getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan(y / x) * 180 / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(props.startAngle, deg), props.endAngle);
    return finalDeg;
  };

  const convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
    return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
  };

  const convertDegreeToValue = (minDegree, maxDegree, minVal, maxVal, selectedDegree) => {
    const degreePercent = (selectedDegree - minDegree) /  (maxDegree - minDegree);
    const newVal = degreePercent * (maxVal - minVal) + minVal;
    return newVal;
  };

  const startDrag = (e) => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2
    };
    console.log(`${knob.left} + ${knob.width} ${knob.top} + ${knob.height}`)
    const moveHandler = e => {
      var currentDeg = getDeg(e.clientX, e.clientY, pts);
      if (props.currentDeg === props.startAngle) currentDeg--;
      let newValue = Math.floor(
        convertDegreeToValue(
          this.startAngle,
          this.endAngle,
          this.props.min,
          this.props.max,
          this.currentDeg
        )
      );
      this.setState({ deg: this.currentDeg, value: newValue });
      console.log(`calling onchange with ${this.newValue}`)
      this.props.onChange(this.newValue);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", e => {
      document.removeEventListener("mousemove", moveHandler);
    });
  }

  return (
    <div className="dial" style={kStyle}>
      <div>{props.value}</div>
      <div className="dial outer" style={oStyle} onMouseDown={startDrag}>
        <div className="dial inner" style={iStyle}>
          <div className="grip" />
        </div>
      </div>
    </div>
  )
}
export default Dial;