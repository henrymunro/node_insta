const { mongoose } = require('../databaseConnection')
const Schema = mongoose.Schema

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  username: { type: String, required: true },
  likesOfThemAutomationDetails: { type: Array },
  likesOfThem: { type: Array },
  likesOfMe: { type: Array },
  followThem: { type: Boolean, default: false },
  followMe: { type: Date },
}, { 
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
		} 
	}
))


/* 
users : { 
	username: ...
	likesOfThemAutomationDetails: [
		{
			runID: _id, 
			startTime: Date
			likes: 0,
			hashtag: ...
		}
	]

}

*/
