const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const userserv = require('../services/userService')
const userService = new userserv()


router.post('/users', async (req, res) => {
    try {
        const {success, user, error} = await userService.create(req.body)
        if (!success) {
            throw new Error(error)
        }

        const token = await userService.generateAuthToken(user)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send({error: e.toString()})
    }
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await userService.findByEmailAndPassword(req.body.email, req.body.password)
        const token = await userService.generateAuthToken(user)
        res.send({user, token})
    } catch (e) {
        res.status(404).send({error: 'Login failed.'})
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await userService.save(req.user)
        res.send()
    } catch (e) {
        res.status(500).send()
    }  
})

// Logout from all logged in sources
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await userService.save(req.user)
        res.send()
    } catch (e) {
        res.status(500).send()
    }  
})

// Fetch user's profile only
router.get('/users/me', auth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch(e) {
        res.status(404).send(e)
    }
})

// Update user's profile only
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidUpdate) {
        return res.status(400).send({error: 'Update failed.'})
    }
    try {
        const { user } = await userService.findOneAndUpdate({_id: req.user._id}, req.body, {new: true})
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    } 
})

// Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await userService.remove(req.user)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router