import React, { useState } from 'react';
import BeatDial from './BeatDial';
const Track = (props) => {
  var items = [];
  for (var i = 0; i < props.beats; i++) {
    items.push(<BeatDial i={i} {...props}/>);
  }
  return (
    <div className="track">
      {items}
    </div>
  )
}
export default Track;