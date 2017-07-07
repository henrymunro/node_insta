import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../reducer'
import actions from '../actions'

import HashtagDetails from './HashtagDetails'


@connect((store, ownProps) => {
  return {

    currentRoute: ownProps.location.pathname,

  }
}, Object.assign({}, actions))

export default class NewAppRun extends React.Component {


  componentWillMount () {
    this.props.getAppRunDetails()
  }


  render () {

    return <div className='container'>
      HELLO
      <HashtagDetails /> 
    </div>
  }
}