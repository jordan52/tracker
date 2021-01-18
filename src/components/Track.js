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
      <div className='controlbox'>
        <Slider
          onChange={(e)=>props.changeTrackLevel(e, props.track)}
          value={props.trackLevels[props.track]}
          id="trackLevelsIt"
          name="trackLevelsIt"
          label="volume"
          min={0}
          max={100}
          step="0.1"
        ></Slider>
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
        <select
          onChange={(e) => props.changeTrackType(e, props.track)}
        >
          <option selected={props.trackTypes[props.track] === 'sine'}>sine</option>
          <option selected={props.trackTypes[props.track] === 'square'}>square</option>
          <option selected={props.trackTypes[props.track] === 'sawtooth'}>sawtooth</option>
          <option selected={props.trackTypes[props.track] === 'triangle'}>triangle</option>
        </select>
        <button className="leftMargin" onClick={(e)=>props.removeTrack(e, props.track)}>- track</button>
      </div>
      {items}
    </div>
  )
}
export default Track;