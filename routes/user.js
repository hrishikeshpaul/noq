var passport = require('passport')
require('../config/passport')(passport)
var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Job = require('../models/Job')

router.get('/:id', function (req, res, next) {

  User.findOne({_id: req.params.id})
    .populate('education')
    .populate('experience')
    .exec(function (err, success) {
      if (err) {
        return res.status(400).send('Error')
      }
      if (success.role == 'student'){
        Job.find({confirmed_users: {$in: [success._id]}})
          .populate('employer')
          .exec(function (err, jobs) {
            if (err) {
              console.log(err)
            }
            success._doc.acceptances = jobs
            return res.status(200).send(success)
          })
      } else {
        Job.find({employer: req.params.id})
          .populate('confirmed_users')
          .exec(function (err, jobs) {
            if (err) {
              console.log(err)
            }
            success._doc.jobs = jobs
            return res.status(200).send(success)
          })
      }
    })
})

router.patch('/:id', function (req, res, next) {
  User.updateOne({_id: req.params.id}, {$set: req.body}, function (err, success) {
    if (err) {
      return res.status(400).send('Error inn updating user')
    }
    return res.status(204).send(JSON.stringify(success))
  })
})

router.patch('/changepassword/:id', function (req, res, next) {
  User.findOne({_id: req.params.id}, function (err, user) {
    if (err)
      console.log(err)
    user.comparePassword(req.body.oldPassword, function (err, isMatch) {
      if (err)
        return res.status(400).send('Could not reset password.')
      if (isMatch) {
        user.password = req.body.newPassword
        user.save(function (err) {
          if (err)
            return res.status(400).send('Could not reset password.')
          return res.status(200).send('Done')
        })
      }
    })
  })
})

module.exports = router
