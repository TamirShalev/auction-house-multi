const request = require('supertest')
const app = require('../app')
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

test('Should create auction for user', async () => {
    await request(app)
        .post('/auctions')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: 'Bad item',
            description: 'wont give you nothing',
            best_offer: 3
        }).expect(200)
})

test('Should NOT create auction for unauthenticated user', async () => {
    await request(app)
        .post('/auctions')
        .send({
            title: 'Bad item',
            description: 'wont give you nothing',
            best_offer: 3
        }).expect(401)
})

test('Should return all existing auctions', async () => {
    const response = await request(app)
        .get('/auctions')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(3)
})

test('Should return only user related auctions', async () => {
    const response = await request(app)
        .get('/auctions/myAuctions')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(2)
})

test('Should return auction by id', async () => {
    const response = await request(app)
        .get(`/auctions/specific/${auctionOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body._id.toString()).toEqual(auctionOne._id.toString())
})

test('Should not allow user to bid his own auctions', async () => {
    const response = await request(app)
        .post(`/auctions/${auctionOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            offer: 30
        })
        .expect(400)
    
    expect(response.body.error).toEqual('You cannot make bids on your own auctions!')
})

test('Should not allow empty offer', async () => {
    const response = await request(app)
        .post(`/auctions/${auctionOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
        })
        .expect(400)
    
    expect(response.body.error).toEqual('Please make an offer')
})

test('Should not allow lower offers than current highest', async () => {
    const response = await request(app)
        .post(`/auctions/${auctionOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            offer: 15
        })
        .expect(400)
    
    expect(response.body.error).toEqual('Current highest offer on this product: 20. Only higher offers allowed.')
})

test('Should update offer after successfull bid', async () => {
    const response = await request(app)
        .post(`/auctions/${auctionOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            offer: 40
        })
        .expect(200)
    const { best_offer, highest_bidder} = response.body
    expect(best_offer).toBe(40)
    expect(highest_bidder.toString()).toEqual(userTwoId.toString())
})

test('Should only fetch auctions created by user', async () => {
    const response = await request(app)
        .get('/auctions/myAuctions')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})