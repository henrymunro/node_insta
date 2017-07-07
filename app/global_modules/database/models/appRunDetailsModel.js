const { mongoose } = require('../databaseConnection')
const Schema = mongoose.Schema

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ApplicationRunDetails', new Schema({
  hashtags: [],
  username: {type: String},
}, { 
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
		} 
	}
))



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
