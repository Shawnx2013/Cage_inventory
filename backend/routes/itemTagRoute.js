const express = require('express');
const router = express.Router();
const { itemTagService } = require('../services');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let result = await itemTagService.findAll();
            res.status(200).json(result);
        // }
    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving all item tags"
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
            let result = await itemTagService.findById(id);

            if(result && result.length > 0){
                return res.status(200).json(result[0])
            } else {
                return res.status(404).json({
                    message: "item tag not found!"
                }).json()
            }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving item tag" + req.params.id
        })
    }
})

router.get('/search/:key', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let search_str = req.params.key;
            let result = await itemService.search(search_str);
            res.status(200).json(result);
        // }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error occured while searching for item tag"
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            // if(req.session.role_id == 1 || req.session.role_id == 3){
                let newItemTag = req.body;
                let result = await itemTagService.create(newItemTag);
                res.status(200).json({
                    id: result
                })
            //}
        //     else {
        //         res.status(403).send();
        //     }
            
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while creating item tag"
        })
    }
})

router.put('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1 || req.session.role_id == 3){
                let newItemTag = req.body;
                let result = await itemTagService.update(newItemTag);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Item Tag updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Item Tag not found/not updated"
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
            message: "Error occured while updating item tag"
        })
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1 || req.session.role_id == 3){
                let id = req.params.id;
                let result = await itemTagService.delete(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Item Tag deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Item Tag not found"
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
            message: "Error occured while deleting item tag"
        })
    }
})

module.exports = router;