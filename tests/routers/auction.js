const express = require('express')
const router = express.Router()
const Auction = require('../models/auction')
const auth = require('../middleware/auth')
const auctionserv = require('../services/auctionService')
const auctionService = new auctionserv()


router.post('/auctions', auth, async (req, res) => {
    const auction = await auctionService.create({
        ...req.body,
        owner: req.user._id
    })

    try {
        await auctionService.save(auction)
        res.send(auction)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Get all existing auctions.
// Supports filtering and sorting.
router.get('/auctions', auth, async (req, res) => {
    console.log("AUCTIONS")
    const searchTerm = req.query.search
    const orderBy = req.query.orderBy === undefined ? 1 : req.query.orderBy
    let sortTerm = {}

    if (req.query.sortBy) {
        sortTerm[req.query.sortBy] = orderBy
    }

    try {
        const { auctions } = await auctionService.findAndSort(searchTerm, sortTerm)
        if(auctions.length === 0) {
            return res.status(404).send()
        }

        res.send(auctions)
    } catch(e) {
        res.status(500).send()
    }
})

// Get auction by id
router.get('/auctions/specific/:id', auth, async (req, res) => {
    try {
        const { auction } = await auctionService.findById(req.params.id)
        if (!auction) {
            return res.status(404).send()
        }

        res.send(auction)
    } catch(e) {
        res.status(500).send()
    }
})

// Make an offer on a specific auction
router.post('/auctions/:id', auth, async (req, res) => {
    const offer = req.body.offer
    try {
        
        let { auction } = await auctionService.findById(req.params.id)

        // offer param not passed or illegal offer
        if (req.user._id.toString() === auction.owner.toString()) {
            return res.status(400).send({error: 'You cannot make bids on your own auctions!'})
        }

        if (!offer) {
            return res.status(400).send({error: 'Please make an offer'})
        }
        if (offer < auction.best_offer) {
            return res.status(400).send({error: `Current highest offer on this product: ${auction.best_offer}. Only higher offers allowed.`})
        }

        const { updatedAuction } = await auctionService.findOneAndUpdate({_id: auction._id}, {best_offer: req.body.offer, highest_bidder: req.user._id}, {new: true})
        res.send(updatedAuction)
    } catch(e) {
        res.status(404).send({error: 'No auction with such ID.'})
    }
    
})

router.get('/auctions/myAuctions', auth, async (req, res) => {
    try {
        const { auctions } = await auctionService.find({owner: req.user._id})
        res.send(auctions)
    } catch(e) {
        res.status(400).send(e)
    }
    

})

module.exports = router