var mongoose = require('mongoose')
var Schema = mongoose.Schema

const educationSchema = new Schema({
  school: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  fieldofstudy: {
    type: String,

  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }

})

module.exports = mongoose.model('Education', educationSchema)
