import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import * as selectors from '../reducer'
import actions from '../actions'

import TimerDisplay from './TimerDisplay'


@connect((store, ownProps) => {
  return {
    startTime: selectors.getStartTime(store),
    currentPercentageDone: selectors.getCurrentPercentageDone(store),
    applicationRunError: selectors.getApplicationRunError(store),
    applicationRunDone: selectors.getApplicationRunDone(store)
  }
}, Object.assign({}, actions))

export default class RunTimer extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
    	duration: 0
    }
    // Interval to 'tick' current run time
    this.interval = setInterval(() => {
      const duration = moment(new Date()).diff(moment(new Date(this.props.startTime)))
      this.setState({duration})
    }, 1000)
  }

  componentWillReceiveProps (nextProps, nextState){
    // If error occours clear timer 
    if (!this.props.applicationRunError && nextProps.applicationRunError) {
      clearInterval(this.interval)
    }

     // If application run completed
    if (!this.props.applicationRunDone && nextProps.applicationRunDone) {
      clearInterval(this.interval)
    } 
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }



  render () {
	const tempTime = moment.duration(this.state.duration)
	const hours =  ("0" + tempTime.hours()).slice(-2) 
	const mins = ("0" + tempTime.minutes()).slice(-2)  
	const seconds = ("0" + tempTime.seconds()).slice(-2) 
    return <div className='row'>
        <div className='col s6 m6 l6'>Start Time: <TimerDisplay timeMS={this.state.duration} /></div>
        <div className='col s6 m6 l6'>Estimated Left: 
          <TimerDisplay timeMS={this.state.duration*((1/(this.props.currentPercentageDone/100)) - 1)} /> 
        </div>
    </div>
  }
}

RunTimer.propTypes = {

}
