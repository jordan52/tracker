import React, { useState }  from 'react';
import './Slider.css';
const Slider = (props) => {
  return (
    <div class='sliderbar'>
      <div>
        <label className='sliderbarlabel' htmlFor={props.id}>{props.label}</label>
        <input
          className='sliderbarinput'
          id={props.id}
          value={props.value}
          type='range'
          onChange={props.volume}
          {...props}>
        </input>
      </div>
    </div>
  )
}
export default Slider;