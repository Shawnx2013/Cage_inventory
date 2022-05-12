const express = require('express');
const router = express.Router();
const {roleService} = require('../services');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let result = await roleService.findAll();
            if(result && result.length > 0){
                return res.status(200).json(result);
            } else {
                return res.status(404).json({
                    message: "user not found!"
                });
            }
        // }
    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving all roles"
        })
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else{
            let id = req.params.id;
            let result = await roleService.findById(id);

            if(result && result.length > 0){
                return res.status(200).json(result[0]);
            } else {
                return res.status(404).json({
                    message: "role not found!"
                });
            }
        //}   
    }catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error occured while retrieving role " + req.params.id
        })
    }
})

router.post('/', async (req, res, next) =>{
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else{
            if(req.session.roleid == 1){
                let newRole = req.body;
                let result = await roleService.create(newRole);
                return res.status(200).json({
                    id: result
                });
            }
            else {
                return res.status(403).send();
            }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error occured while creating role"
        })
    }
})

module.exports = router;