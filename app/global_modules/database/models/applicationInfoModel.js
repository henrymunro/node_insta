const { mongoose } = require('../databaseConnection')
const Schema = mongoose.Schema

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ApplicationInfo', new Schema({
  hashtags: [],
  username: {type: String, default: 'henrymunro'},
  finishTime: {type: Date},
  done: {type: Boolean, default: false},
  totalToLike: {type: Number},
  error: { type: Boolean, default: false }, 
  totalLikes: { type: Number, default: 0 }, 
  inspected: {type: Number, default: 0}, 
}, { 
	timestamps: { 
		createdAt: 'startTime',
		updatedAt: 'updatedAt' 
		} 
	}
))



/* 
Hashtags: [
{
  hashtag: ...,
  inspected: 78, 
  userInspected: 0,
  userLiked: 0,
  probability: 0.8,
  minDate: ..., 
  likes: [
    {
      username: ...,
      date: ....,
      imageURL: ...,
    }
  ],
  users: [
    {
      username: ...
      likes: 4,
      inspected: 10,
      probability: 0.5
    }
  ]
}
]

*/
