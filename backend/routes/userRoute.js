const express = require('express');
const router = express.Router();
const {userService} = require('../services');
// const sessionStore = require('../db/session');

router.get('/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else{
            let id = req.params.id;
            // if(req.session.user_id == id){
                let result = await userService.findById(id);

                if(result && result.length > 0){
                    return res.status(200).json(result[0]);
                } else {
                    return res.status(404).json({
                        message: "user not found!"
                    });
                }
            // }
            // else {
            //     res.status(403).send();
            // }
        //}
    } catch (e){
        console.log(e);
        res.status(500).send({
            message: "Error occured while retrieving user " + req.params.id
        })
    }
})

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else{
        //     if(req.session.role_id == 1){
                let result = await userService.findAll();

                if(result && result.length > 0){
                    return res.status(200).json(result);
                } else {
                    return res.status(404).json({
                        message: "user not found!"
                    });
                }
            // }
            // else {
            //     res.status(403).send();
            // }
        //}
    }catch (e){
        console.log(e);
        res.status(500).send({
            message: "Error occured while retrieving user " + req.params.id
        })
    }
})

router.post('/', async (req, res, next) =>{
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            // if(req.session.role_id == 1){
                let newUser = req.body;
                let result = await userService.create(newUser);
                res.status(200).json({
                    id: result
                })
            // }
            // else {
            //     res.status(403).send();
            // }
        // }
    } catch (e){
        console.log(e);
        res.status(500).send({
            message: "Error occured while creating user"
        })
    }
})

router.post('/auth', async (req, res, next) =>{
    try{
        let inputUsername = req.body.username;
        let inputPassword = req.body.password;
        console.log(inputUsername);
        let result = await userService.findByUsername(inputUsername);
        let user = result[0].username;
        let password = result[0].password;
        // if(req.session.auth){
        //     res.status(200).json({message: "user already logged in"})
        // }
        // else{
            if(user === inputUsername && password === inputPassword){
                // req.session.auth = true;
                // req.session.user_id = result[0].id;
                // req.session.user = user;
                // req.session.role_id = result[0].role_id;
                // req.session.save();
                // console.log(req.sessionID);
                return res.status(200).json(result);
            }
            else{
                return res.status(401).json({message: "wrong crendetials"})
            }
        // }
    } catch(e) {
        console.log(e);
        res.status(500).send({
            message: "Error occured while authenticating user"
        })
    }
})

router.get('/auth/logout', (req, res) => {

    req.session.destroy((err) => {
        if(err){
            console.log(error);
            return res.status(500).send({
                message: "Error occured while logging out user"
            })
        }
        sessionStore.close();
        res.clearCookie('cage_session');
        return res.status(200).json({message: "logged out"});
    });
})

module.exports = router;
