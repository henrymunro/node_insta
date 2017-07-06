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
    applicationRunError: selectors.getApplicationRunError(store)
  }
}, Object.assign({}, actions))

export default class AppStatus extends React.Component {

  constructor (props) {
    super(props)
    this.interval = setInterval(() => {
      this.props.getCurrentAppInfo()
    }, 1000)
  }

  componentWillReceiveProps (nextProps, nextState){
    // If applicaiton errors out stop polling the server
    if (!this.props.applicationRunError && nextProps.applicationRunError) {
      clearInterval(this.interval)
    }
  }

  componentWillMount () {
    this.props.getCurrentAppInfo()
  }

  render () {

    const { currentAppInfo, applicationRunError } = this.props
    const { hashtags } = currentAppInfo

    return <div className='container'>
      {applicationRunError && <h3 style={{color: 'red'}}>AN ERROR HAS OCCOURED</h3>}
      <AppStatusOverview {...currentAppInfo} percentageComplete={this.props.currentPercentageDone}/>
      <RunTimer/>
      {hashtags && hashtags.map((hashtag, key) => <Hashtag {...hashtag} key={key} />)}
    </div>
  }
}