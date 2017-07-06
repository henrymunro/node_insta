import React from 'react'
import moment from 'moment'
import LinearProgress from 'material-ui/LinearProgress'


export default class AppStatus extends React.Component {

  render () {
    return <div className='row'>
        <p>Start Time: {moment(new Date(this.props.startTime)).format('Do-MMM-YY')}</p>
        <div className="col s4 m4 l4">
            Total To Inspect: {this.props.totalToLike}
        </div>
        <div className="col s4 m4 l4">
            Inspected: {this.props.inspected}
        </div>
        <div className="col s4 m4 l4">
            Total Likes: {this.props.totalLikes}
        </div>
        <LinearProgress mode="determinate" value={this.props.percentageComplete} />
    </div>
  }
}

AppStatus.propTypes = {
    totalToLike: React.PropTypes.number,
    inspected: React.PropTypes.number,
    totalLikes: React.PropTypes.number,    
    percentageComplete: React.PropTypes.number,
}
