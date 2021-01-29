const request = require('supertest')
const app = require('../app')
const process = require('process')
const { userService,
        auctionService,
        userOneId,
        userOne,
        userTwoId,
        userTwo,
        auctionOne,
        auctionTwo,
        auctionThree,
        setupDatabase } = require('../preps/db')


beforeEach(setupDatabase)

test('Should create valid user', async () => {
    await request(app).post('/users').send({
        name: "Tamir",
        email: "TAMIR@GMAIL.COM",
        age: 50,
        password: "123123123123"
    }).expect(201)
})


test('Should not create invalid user', async () => {
    await request(app).post('/users').send({
        name: "Tamir",
        email: "",
        age: 50,
        password: "123123123123"
    }).expect(400)
})

test('Should login existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'userone@example.com',
            password: 'userone123'
        })
        .expect(200)
})

test('Should NOT login non-existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'DOESNTEXIST@example.com',
            password: 'userone123'
        })
        .expect(404)
})

test('Should logout user', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})       

test('Should fetch user profile only', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.name).toEqual('userone')
})

test('Should NOT fetch unauthenticated user', async () => {
    const response = await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should update user details', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({name: 'useronemodified'})
        .expect(200)
    
    const {user} = await userService.findById(userOneId)
    expect(user.name).toEqual('useronemodified')
})

test('Should NOT update invalid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({height:57})
        .expect(400)
})

test('Should NOT update unauthenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .send({name: 'somethingelse'})
        .expect(401)
})

test('Should delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const {user} = await userService.findById(userOneId)
    expect(user).toBeNull()
})

test('Should NOT delete unauthenticated users', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete user auctions when user deleted', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const {auctions} = await auctionService.find({owner: userOneId})
    expect(auctions.length).toBe(0)

})
