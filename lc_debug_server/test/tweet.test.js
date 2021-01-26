const app  = require('../app.js')
const { User, sequelize, Tweet } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize
const jwt = require('jsonwebtoken')

describe('Tweet Routes Test', () => {
  let userToken, userToken2, user2Tweet

  const userData = {
    email: 'd@mail.com',
    password: 'qweqwe'
  }

  const userData2 = {
    email: 's@mail.com',
    password: 'qweqwe'
  }

  beforeAll(done => {
    User.create(userData)
      .then(user => {
        userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        return User.create(userData2)
      })
      .then(user2 => {
        userToken2 = jwt.sign({ id: user2.id }, process.env.JWT_SECRET)
        return Tweet.create({
          content: 'semoga wabah ini cepat selesai',
          UserId: user2.id
        })
      })
      .then(tweet => {
        user2Tweet = tweet
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  afterAll(done => {
    queryInterface
      .bulkDelete('Users', {})
      .then(() => queryInterface.bulkDelete('Tweet', {}))
      .then(() => done())
      .catch(err => done(err))
  })

  describe('POST /tweet - create new tweet', () => {
    const tweetContent = 'Ini dummy content'

    test('201 Success post tweet - should create new Tweet', (done) => {
      request(app)
        .post('/tweets')
        .send({
          content: 'Suikoden 2 is the best jrpg for now'
        })
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(201)
          expect(body).toHaveProperty('id', expect.any(Number))
          expect(body).toHaveProperty('content', 'Suikoden 2 is the best jrpg for now')
          done()
        })
    })

    test('400 Failed post tweet - should return error if content is null', (done) => {
      request(app)
        .post('/tweets')
        .send({})
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', 'Content cannot be empty')
          done()
        })
    })

    test('400 Failed post tweet - should return error if content length < 4', (done) => {
      request(app)
        .post('/tweets')
        .send({
          content: 'hei'
        })
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', 'Content length must between 4 - 255')
          done()
        })
    })

    test('400 Failed post tweet - should return error if content length > 255', (done) => {
      request(app)
        .post('/tweets')
        .send({
          content: `Git's main job is to make sure you never lose a committed change. But it's also designed to give you total control over your development workflow. This includes letting you define exactly what your project history looks like; however, it also creates the potential of losing commits. Git provides its history-rewriting commands under the disclaimer that using them may result in lost content.
          Git has several mechanisms for storing history and saving changes. These mechanisms include: Commit --amend, git rebase and git reflog. These options give you powerful work flow customization options. By the end of this tutorial, you'll be familiar with commands that will let you restructure your Git commits, and be able to avoid pitfalls that are commonly encountered when rewriting history.`
        })
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', 'Content length must between 4 - 255')
          done()
        })
    })

    test('400 Failed post tweet - should return error if access_token not provided', (done) => {
      request(app)
        .post('/tweets')
        .send({
          content: tweetContent
        })
        .then(response => {
          const { body, status } = response
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', 'Failed to authenticate')
          done()
        })
    })

    
  })

  describe('DELETE /tweet - delete a tweet', () => {

    test('401 Failed delete tweet - should not delete a Tweet if not authorized', (done) => {
      request(app)
        .delete('/tweets/' + user2Tweet.id)
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', 'You are not authorized')
          done()
        })
    })

    test('401 Failed delete tweet - should not delete a Tweet if not login', (done) => {
      request(app)
        .delete('/tweets/' + user2Tweet.id)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', 'Failed to authenticate')
          done()
        })
    })

    test('404 Failed delete tweet - should not delete a Tweet if not found', (done) => {
      request(app)
        .delete('/tweets/9999')
        .set('access_token', userToken)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(404)
          expect(body).toHaveProperty('message', 'Tweet not found')
          done()
        })
    })

    test('200 Success delete tweet - should delete a Tweet if authorized', (done) => {
      request(app)
        .delete('/tweets/' + user2Tweet.id)
        .set('access_token', userToken2)
        .then(response => {
          const { body, status } = response
          expect(status).toBe(200)
          expect(body).toHaveProperty('message', 'Success delete a tweet')
          done()
        })
    })
    
  })
})
