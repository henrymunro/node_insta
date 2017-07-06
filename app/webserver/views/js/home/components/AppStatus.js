import React from 'react'
import LinearProgress from 'material-ui/LinearProgress'


export default class AppStatus extends React.Component {

  render () {

    const percentageComplete = this.props.inspected * 100.0 / this.props.totalToLike || 0 

    return <div>
        <p>Start Time: {this.props.startTime}</p>
        <p>Total To Inspect: {this.props.totalToLike}</p>
        <p>Inspected: {this.props.inspected}</p>
        <p>Total Likes: {this.props.totalLikes}</p>
        <LinearProgress mode="determinate" value={percentageComplete} />
    </div>
  }
}

AppStatus.propTypes = {

}
