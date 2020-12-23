import React from 'react';

const Beat = (props) => {
  return (
    <div className={`beat ${props.tick == props.i ? "red":""}`}>{props.i}</div>
  )
}
export default Beat;