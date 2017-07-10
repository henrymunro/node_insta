import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../reducer'
import actions from '../actions'

import AppStatusOverview from './AppStatusOverview'
import RunTimer from './RunTimer.container'
import Hashtag from './Hashtag'


@connect((store, ownProps) => {
  return {

    currentRoute: ownProps.location.pathname,
    currentAppInfo: selectors.getCurrentAppInfo(store),
    currentPercentageDone: selectors.getCurrentPercentageDone(store),
    applicationRunError: selectors.getApplicationRunError(store),
    applicationRunDone: selectors.getApplicationRunDone(store),
    skip: selectors.getSkip(store),
    stopPoll: selectors.getStopPoll(store),
  }
}, Object.assign({}, actions))

export default class AppStatus extends React.Component {

  constructor (props) {
    super(props)
    this.interval = setInterval(() => {
      this.props.getCurrentAppInfo()
    }, 5000)
  }

  componentWillReceiveProps (nextProps, nextState){
    // If applicaiton errors out stop polling the server
    if (!this.props.applicationRunError && nextProps.applicationRunError) {
      clearInterval(this.interval)
    }

    // If stop poll is set to true (force stop poll on skip to previous run info)
    if (!this.props.stopPoll && nextProps.stopPoll) {
      clearInterval(this.interval)
    }

    // If application run completed
    if (!this.props.applicationRunDone && nextProps.applicationRunDone) {
      clearInterval(this.interval)
    } 
  }

  componentWillMount () {
    this.props.getCurrentAppInfo()
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  getPreviousAppInfo () {
    this.props.getPreviousAppInfo(this.props.skip)
    this.props.updateAppStatusProp({skip: Number(this.props.skip) + 1})
  }

  render () {

    const { currentAppInfo, applicationRunError, applicationRunDone } = this.props
    const { hashtags } = currentAppInfo

    return <div className='container'>
      <h5 onClick={this.getPreviousAppInfo.bind(this)}>Skip: {this.props.skip}</h5>
      {applicationRunError && <h3 style={{color: 'red'}}>AN ERROR HAS OCCOURED</h3>}
      {applicationRunDone && <h3 style={{color: 'green'}}>FINISHED</h3>}
      <AppStatusOverview {...currentAppInfo} percentageComplete={this.props.currentPercentageDone}/>
      <RunTimer/>
      {hashtags && hashtags.map((hashtag, key) => <Hashtag {...hashtag} key={key} />)}
    </div>
  }
}