const express = require('express');
const router = express.Router();
const { kitService } = require('../services');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let result = await kitService.findAll();
            if(result && result.length > 0){
                let kits = [];
                for (const r of result){
                    let items = await kitService.findItemsById(r.id);
                    items = items.map((item) => { return item.item_id });
                    kits.push({
                        id: r.id,
                        name: r.name,
                        creator_id: r.creator_id,
                        description: r.description,
                        count: r.count,
                        long_term_loanable: r.long_term_loanable,
                        location: r.location,
                        items: items
                    })
                }
                return res.status(200).json(kits);
            } else {
                return res.status(200).json(result);
            }
        // }
    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving all kits"
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
            let result = await kitService.findById(id);
            let items = await kitService.findItemsById(id);
            items = items.map((item) => { return item.item_id });
            let kit = {
                id: result[0].id,
                name: result[0].name,
                creator_id: result[0].creator_id,
                description: result[0].description,
                count: result[0].count,
                long_term_loanable: result[0].long_term_loanable,
                location: result[0].location,
                items: items
            }
            if(result && result.length > 0){
                return res.status(200).json(kit)
            } else {
                return res.status(404).json({
                    message: "item not found!"
                })
            }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving item " + req.params.id
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
            let result = await kitService.search(search_str);
            res.status(200).json(result);
        // }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error occured while searching for item"
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            //if(req.session.role_id == 1 || req.session.role_id == 3){
                let newKit = req.body;
                let result = await kitService.create(newKit);
                res.status(200).json({
                    id: result
                })
            // }
            // else {
            //     res.status(403).send();
            // }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while creating item"
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
                let newKit = req.body;
                let result = await kitService.update(newKit);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Kit updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Kit not found/not updated"
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
            message: "Error occured while updating kit"
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
                let result = await kitService.delete(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Kit deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Kit not found"
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
                message: "This kit belongs to a reservation"
            })
        } else {
            return res.status(500).json({
                message: "Error occured while deleting kit"
            })
        }
    }
})

module.exports = router;