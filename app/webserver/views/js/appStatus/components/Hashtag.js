import React from 'react'
import LinearProgress from 'material-ui/LinearProgress'


export default class Hashtag extends React.Component {

  render () {

    const percentageComplete = (this.props.inspected || 0) * 100.0 / this.props.count || 0 
    const userPercentageComplete = (this.props.userInspected || 0) * 100.0 / (this.props.userCount * this.props.userPhotoCount) || 0

    return <div>
        <h5>{this.props.hashtag}: {(this.props.inspected || 0) + (this.props.userInspected || 0)} / {this.props.count + (this.props.userCount * this.props.userPhotoCount) || 0}</h5>
        <p>Users: {(this.props.users || []).length} / {this.props.userCount}</p>
        <LinearProgress mode="determinate" value={percentageComplete} />
        <LinearProgress mode="determinate" value={userPercentageComplete} />
    </div>
  }
}

Hashtag.propTypes = {

}
