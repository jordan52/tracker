import React, { useState } from 'react';
import Beat from './Beat';
const Track = (props) => {
  var items = [];
  for (var i = 0; i < props.beats; i++) {
    items.push(<Beat i={i} {...props}/>);
  }
  return (
    <div className="track">
      {items}
    </div>
  )
}
export default Track;