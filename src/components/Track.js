import React, { useState } from 'react';
import BeatDial from './BeatDial';
import Slider from "./Slider";
const Track = (props) => {
  var items = [];
  for (var i = 0; i < props.beats; i++) {
    items.push(<BeatDial i={i} level={props.beatLevels[props.track][i]} freq={props.beatFreqs[props.track][i]}{...props}/>);
  }
  return (
    <div className="track">
      <Slider
        onChange={(e)=>props.changePan(e, props.track)}
        value={props.pan[props.track]}
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