import React, { useState } from 'react';
import Track from './Track';
import BeatDial from "./BeatDial";
const Grid = (props) => {
  var tracks = [];
  for (var i = 0; i < props.tracks; i++) {
    tracks.push(<Track track={i} {...props}/>);
  }
  return (
    <div className="stacktrack">
      <div>
        {tracks}
      </div>

    </div>
  )
}
export default Grid;