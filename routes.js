'use strict';

const express = require('express');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user')
const router = express.Router();


function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
  }


// User Routes
router.get('/users', authenticateUser, asyncHandler(async(req,res) => {
    const user = await User.findByPk(req.currentUser.id, {
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
        },
    });
    if (user) {
      res.status(200).json(user);
    }
  }));

  
  router.post('/users', asyncHandler(async(req,res) => {
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({errors});
      } else {
        throw error;
      }
    } 
  }));


  //Courses Routes
  router.get('/courses', asyncHandler(async(req,res) => {
    const courses = await Course.findAll({
        include: [{
            model: User,
            as: 'Enrolled',
        }], 
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }, 
        });
      res.status(200).json(courses);
  }));



  router.get('/courses/:id', asyncHandler(async(req,res) => {
    const course = await Course.findByPk(req.params.id, { attributes: {
        exclude: ['createdAt', 'updatedAt']
    }, 
        include: [{
            model: User,
            as: 'Enrolled',
        }], 
    });
    if (course) {
      res.status(200).json({course});
    } else {
        res.status(401).json({message: 'No results found.'});
    }
  }));


  router.post('/courses', authenticateUser, asyncHandler(async(req,res) => {
    try {
        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            userId: req.currentUser.id
        });
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json(errors);
          } else {
            throw error;
          }
    } 
  }));


  router.put('/courses/:id', authenticateUser, asyncHandler(async(req,res) => {
    const course = await Course.findByPk(req.params.id);
    const userId = await Course.findByPk(req.params.userId);
    if (course) {
        if (req.body.description && req.body.title) {
            try {
                Course.update({
                    title: req.body.title,
                    description: req.body.description,
                    estimatedTime: req.body.estimatedTime,
                    materialsNeeded: req.body.materialsNeeded,
                }, 
                {   where: {id: req.params.id} });
                await course.save();
                res.status(204).end();
            } catch (error) {
                if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400).json({errors});
                } else if (userId !== authenticateUser) {
                    res.status(403).json({message: "You cannot update a course that you don't own."});
                } else {
                    throw error;
                    }
                }
        
    } else {
        res.status(400).json({message: "Please enter a title and a description."});
    } 
} else {
    res.status(404).json({message: "The course that you are trying to update does not exist."});
}
  }));


  router.delete('/courses/:id', authenticateUser, asyncHandler(async(req,res) => {
    const course = await Course.findOne({id: req.params.id});
    const user = await User.findByPk(req.currentUser.id);
    if (course) {
      Course.destroy({   where: {id: req.params.id} });  
      res.status(204).json({message: 'Course deleted.'}).end();
    } else if (user !== authenticateUser) {
        res.status(403).json({message: "You cannot delete a course that you don't own."});
      }
    else {
        res.status(404).json({message: "The course that you are trying to delete does not exist."});
    }
  }));

  module.exports = router;