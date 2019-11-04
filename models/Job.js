var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String
  },
  position: {
    type: String
  },
  description: {
    type: String
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  employer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  applicants: [{type: Schema.Types.ObjectId, ref: 'User'}],
  confirmed_users: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
  rejected_users: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
  deadline: {
    type: Date
  },
  skills: {
    type: Array
  }

});

module.exports = mongoose.model('Job', jobSchema);
