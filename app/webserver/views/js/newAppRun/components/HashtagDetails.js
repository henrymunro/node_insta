import React from 'react'
import TextField from 'material-ui/TextField'


export default class HashtagDetails extends React.Component {

  render () {

    const thinTextField = {
      width: '80px',
      height: '30px'
    }

    return <div>
          <div className="row">
            <div className="col s3 m3 l3">
              <TextField fullWidth id='hashtag' defaultValue={this.props.hashtag} hintText="Hashtag"/>
            </div>
            <div className="col s5 m5 l5">
              <div style={{float: 'left'}}>Count: </div>
              <div style={{float: 'left'}}>
                <TextField id='countMin' defaultValue={this.props.countMin} hintText="Min" style={thinTextField}/>
              </div>
              <div style={{float: 'left'}}>to </div>
              <div style={{float: 'left'}}>
                <TextField id='countMax' defaultValue={this.props.countMax} hintText="Max" style={thinTextField}/>
              </div>
            </div>
            <div className="col s4 m4 l4">
              <div style={{float: 'left'}}>Probability: </div>
              <div style={{float: 'left'}}>
                <TextField id='probability' defaultValue={this.props.probability} style={thinTextField}/>
              </div>
              <div style={{float: 'left'}}>%</div>
            </div>
          </div>
          <div className="row">
            <h5>User Details:</h5>
            <div className="row">
              <div className="col s8 m8 l8">
                <div style={{float: 'left'}}>User Count: </div>
                <div style={{float: 'left'}}>
                  <TextField id='userCountMin' defaultValue={this.props.userCountMin} hintText="Min" style={thinTextField}/>
                </div>
                <div style={{float: 'left'}}>to </div>
                <div style={{float: 'left'}}>
                  <TextField id='userCountMax' defaultValue={this.props.userCountMax} hintText="Max" style={thinTextField}/>
                </div>
              </div>
              <div className="col s4 m4 l4">
                <div style={{float: 'left'}}>User Probability: </div>
                <div style={{float: 'left'}}>
                  <TextField id='userProbability' defaultValue={this.props.userProbability} style={thinTextField}/>
                </div>
                <div style={{float: 'left'}}>%</div>
              </div>
            </div>


            <div className="row">
              <div className="col s8 m8 l8">
                <div style={{float: 'left'}}>User Photo Count: </div>
                <div style={{float: 'left'}}>
                  <TextField id='userPhotoCountMin' defaultValue={this.props.userPhotoCountMin} hintText="Min" style={thinTextField}/>
                </div>
                <div style={{float: 'left'}}>to </div>
                <div style={{float: 'left'}}>
                  <TextField id='userPhotoCountMax' defaultValue={this.props.userPhotoCountMax} hintText="Max" style={thinTextField}/>
                </div>
              </div>
            </div>
          </div>
        </div>
  }
}

HashtagDetails.propTypes = {
    hashtag: React.PropTypes.string,
    countMin: React.PropTypes.number, 
    countMax: React.PropTypes.number, 
    probability: React.PropTypes.number,
    userCountMin: React.PropTypes.number, 
    userCountMax: React.PropTypes.number, 
    userPhotoCountMin: React.PropTypes.number, 
    userPhotoCountMax: React.PropTypes.number, 


}




/* 
Hashtags: [
  // {
  //  hashtag: 'bikeTour', 
  //  probability:0.85, 
  //  countMax:_20,
  //  countMin: 30 
  //  userCountMin: 4, 
  //  userCountMax: 10, 
  //  userProbability: 0.5, 
  //  userPhotoCountMin: 6, 
  //  userPhotoCountMax: 10
  // }
]

*/
