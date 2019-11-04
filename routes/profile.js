var mongoose = require('mongoose')
var passport = require('passport')
require('../config/passport')(passport)
var express = require('express')
var router = express.Router()
var User = require('../models/user');
var Education = require('../models/Education')
var Experience = require('../models/Experience')
const { check, validationResult } = require('express-validator')


router.post('/updateRole', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  console.log(req.body)
  User.findOneAndUpdate({_id: req.body.user}, {$set: {role: req.body.role}}, function (err, succ) {
    if (err)
      return res.status(400).send('Error')
    return res.status(204).send('Done')
  })
})
/*
* Only for name, company/university, website and social websites
* Fix social websites updating to blank if empty being sent
*/
router.post('/personal', passport.authenticate('jwt', {session: false}), function (req, res, next) {

  // removing keys that don't have a value to prevent false updates
  req.body.data = Object.entries(req.body.data).reduce((a,[k,v]) => (v ? {...a, [k]:v} : a), {})
  // if object is empty then return an error
  if (Object.entries(req.body.data).length === 0 && req.body.data.constructor === Object) {
    return res.status(400).send('All Fields Can\'t Be Empty')
  }

  User.findOne({_id: req.body.user.id}, function (err, profile) {
    if (profile) {
      User.updateOne({_id: req.body.user.id}, req.body.data, function (err, profile) {
        if (err)
          return res.status(400).send('Server Error')
        return res.status(204).send(profile)
      })
    } else {
      new User(req.body.data).save(function (err, profile) {
        if (err)
          return res.status(400).send('Server Error')
        return res.status(201).send(profile)
      })
    }
  })
})

/*
* Only education
*/
router.post('/education', passport.authenticate('jwt', { session: false }), function (req, res, err) {
  var arr = []
  req.body.data.forEach(edu => {
    arr.push(Object.entries(edu).reduce((a,[k,v]) => (v ? {...a, [k]:v} : a), {}))
  })

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if(arr.length > 1) {
    arr.forEach(education => {
      new Education(education).save(function (err, edu) {
        if (err)
          console.log('Education can\'t be saved')
        User.updateOne({_id: req.body.user.id}, {$addToSet: {education: edu._id}}, function (err, success) {
          if (err)
            console.log(err)
        })
      })
    })
  }
  return res.status(201).send('Saved')
})

router.patch('/education/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Education.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, succ) {
    if (err)
      return res.status(400).send('Error')
    else return res.status(200).send('Done')
  })
})

/**
 * Does not cascade DELETE
**/

router.delete('/education/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Education.remove({_id: req.params.id}, function (err, succ) {
    if (err)
      return res.status(400).send('Error')
    else return res.status(200).send('Done')
  })
})

/*
* Only experience
* PUT, DELETE route to come after profile page is made!
*/
router.post('/experience', passport.authenticate('jwt', { session: false }), function (req, res, err) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.body.data.length > 0) {
    req.body.data.forEach(experience => {
      new Experience(experience).save(function (err, exp) {
        if (err)
          console.log(err)
        else {
          User.updateOne({_id: req.body.user.id}, {$addToSet: {experience: exp._id}}, function (err, success) {
            if (err)
              console.log('err')
          })
        }
      })
    })
  }
  return res.status(201).send('Saved')
})

router.patch('/experience/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Experience.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, succ) {
    if (err)
      return res.status(400).send('Error')
    else return res.status(200).send('Done')
  })
})

/**
 * Does not cascade DELETE
 **/

router.delete('/experience/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Experience.remove({_id: req.params.id}, function (err, succ) {
    if (err)
      return res.status(400).send('Error')
    else return res.status(200).send('Done')
  })
})

/*
* Only skills
* PUT route to come after profile page is made!
*/
router.post('/skills', passport.authenticate('jwt', { session: false }), function (req, res, err) {
  console.log(req.body.data)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  if (req.body.data.length > 0) {
    User.updateOne({_id: req.body.user.id}, {$set: {skills: req.body.data}}, function (err, succc) {
      if (err)
        console.log(err)
      else return res.status(201).send('Saved')
    })

  } else {
    return res.status(200).send('Nothing added')
  }
})

module.exports = router
