import React from 'react'
import moment from 'moment'

export default class TimerDisplay extends React.Component {

  render () {

	const tempTime = moment.duration(this.props.timeMS)
	const hours =  ("0" + tempTime.hours()).slice(-2) 
	const mins = ("0" + tempTime.minutes()).slice(-2)  
	const seconds = ("0" + tempTime.seconds()).slice(-2) 
    return <div>{`${hours}:${mins}:${seconds}`}</div>
  }
}

TimerDisplay.propTypes = {
  timeMS: React.PropTypes.number
}
