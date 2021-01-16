import React, { useState }  from 'react';
import './Slider.css';
const Slider = (props) => {
  return (
    <div className='sliderbar'>
      <div>
        <label className='sliderbarlabel' htmlFor={props.id}>{props.label} {props.value}</label>
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