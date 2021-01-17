import React, { useState } from 'react';
import BeatDial from './BeatDial';
import Slider from "./Slider";
const Track = (props) => {
  var items = [];
  for (var i = 0; i < props.beats; i++) {
    items.push(<BeatDial i={i} level={props.beatLevels[i]} freq={props.beatFreqs[i]}{...props}/>);
  }
  return (
    <div className="track">
      <Slider
        onChange={props.changePan}
        value={props.pan}
        id="panit"
        name="panit"
        label="pan"
        min={-1}
        max={1}
        step="0.1"
      ></Slider>
      {items}
    </div>
  )
}
export default Track;