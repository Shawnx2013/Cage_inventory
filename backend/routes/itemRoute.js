const express = require('express');
const router = express.Router();
const { itemService } = require('../services');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let result = await itemService.findAll();
            if(result && result.length > 0){
                let items = [];
                for (const r of result){
                    let tags = await itemService.findTagsById(r.id);
                    tags = tags.map((tag) => { return tag.tag_id });
                    items.push({
                        id: r.id,
                        name: r.name,
                        type: r.type,
                        description: r.description,
                        version: r.version,
                        long_term_loanable: r.long_term_loanable,
                        location_id: r.location_id,
                        tags: tags
                    })
                }
                return res.status(200).json(items);
            } else {
                return res.status(200).json(result);
            }
        //}
    } catch (e){
        console.log(e);
        return res.status(500).json({
            message: "Error occured while retrieving all items"
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
            let result = await itemService.findById(id);
            let tags = await itemService.findTagsById(id);
            tags = tags.map((tag) => { return tag.tag_id });
            let item = {
                id: result[0].id,
                name: result[0].name,
                type: result[0].type,
                description: result[0].description,
                version: result[0].version,
                long_term_loanable: result[0].long_term_loanable,
                location_id: result[0].location_id,
                tags: tags
            }
            if(result && result.length > 0){
                return res.status(200).json(item)
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
            let result = await itemService.search(search_str);
            return res.status(200).json(result);
        //}
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
        //     if(req.session.role_id == 1){
                let newItem = req.body;
                let result = await itemService.create(newItem);
                return res.status(200).json({
                    id: result
                })
        //    }
        //     else {
        //         res.status(403).send();
        //     }
        // }
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
        //     if(req.session.role_id == 1){
                let newItem = req.body;
                let result = await itemService.update(newItem);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Item updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Item not found/not updated"
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
            message: "Error occured while updating item"
        })
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            //if(req.session.role_id == 1){
                let id = req.params.id;
                let result = await itemService.delete(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Item deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Item not found"
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
                message: "This item belongs to a reservation"
            })
        } else {
            return res.status(500).json({
                message: "Error occured while deleting item"
            })
        }
    }
})

module.exports = router;