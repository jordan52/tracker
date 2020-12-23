import React, { useState } from 'react';
import Track from './Track';
const Grid = (props) => {
  return (
    <div className="stacktrack">
      <div>
        <Track {...props}/>
      </div>
      <div>
        <Track {...props}/>
      </div>
      <div>
        <Track {...props}/>
      </div>
      <div>
        <Track {...props}/>
      </div>
    </div>
  )
}
export default Grid;