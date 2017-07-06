import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../reducer'
import actions from '../actions'

import AppStatus from './AppStatus'
import RunTimer from './RunTimer.container'
import Hashtag from './Hashtag'


@connect((store, ownProps) => {
  return {

    currentRoute: ownProps.location.pathname,
    currentAppInfo: selectors.getCurrentAppInfo(store)
  }
}, Object.assign({}, actions))

export default class Home extends React.Component {

  componentWillMount () {
    this.props.getCurrentAppInfo()
  }

  componentDidMount () {

    setInterval(() => {
      this.props.getCurrentAppInfo()
    }, 3000)
  }

  render () {

    const { currentAppInfo } = this.props
    const { hashtags } = currentAppInfo

    return <div>
      Hello
      <AppStatus {...currentAppInfo} />
      <RunTimer/>
      {hashtags && hashtags.map((hashtag, key) => <Hashtag {...hashtag} key={key} />)}
    </div>
  }
}