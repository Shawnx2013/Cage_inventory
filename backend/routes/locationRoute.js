const express = require('express');
const router = express.Router();
const { locationService } = require('../services');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let result = await locationService.findAll();
            res.status(200).json(result);
        // }
    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving all locations"
        })
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let id = req.params.id;
            let result = await locationService.findById(id);

            if(result && result.length > 0){
                return res.status(200).json(result[0])
            } else {
                return res.status(404).json({
                    message: "Location not found!"
                })
            }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving location " + req.params.id
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1){
                let newlocation = req.body;
                let result = await locationService.create(newlocation);
                res.status(200).json({
                    id: result
                })
        //     }
        //     else {
        //         res.status(403).send();
        //     }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while creating location"
        })
    }
})

router.put('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1){
                let newLocation = req.body;
                let result = await itemService.update(newLocation);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Location updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Location not found/not updated"
                    })
                }
        //     }
        //     else {
        //         res.status(403).send();
        //     }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while updating location"
        })
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1){
                let id = req.params.id;
                let result = await locationService.delete(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Location deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Location not found"
                    })
                }
        //     }
        //     else {
        //         res.status(403).send();
        //     }
        // }
    } catch (e) {
        console.log(e);
        if(e.errno == 1451){
            return res.status(500).json({
                message: "An item still exists in this location"
            })
        } else {
            return res.status(500).json({
                message: "Error occured while deleting location"
            })
        }
    }
})

module.exports = router;