const express = require('express');
const router = express.Router();
const { reservationService, userService, itemService } = require('../services');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('../db/database');

router.get('/', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else{
            // if(req.session.role_id == 1){
                let result = await reservationService.findAll();
                res.status(200).json(result);
            // }
            // else {
            //     res.status(403).send();
            // }
        //}
    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving all reservations"
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
            let result = await reservationService.findById(id);
            let items = await reservationService.findItemReservedById(id);
            items = items.map((item) => { return item.item_id });
            let kits = await reservationService.findKitReservedById(id);
            kits = kits.map((kit) => { return kit.kit_id });
            let reservation = {
                id: result[0].id,
                user_id: result[0].user_id,
                loan_start: result[0].loan_start,
                loan_end: result[0].loan_end,
                items: items,
                kits: kits
            }
            if(result && result.length > 0){
                return res.status(200).json(reservation);
            } else {
                return res.status(404).json({
                    message: "Reservation not found!"
                })
            }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving reservation " + req.params.id
        })
    }
})

router.get('/usr/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let userid = req.params.id;
            let result = await reservationService.findAllByUserId(userid);
            if(result && result.length > 0){
                if(result.length > 1){
                    let reservations = [];
                    for (const r of result){
                        let items = await reservationService.findItemReservedById(r.id);
                        items = items.map((item) => { return item.item_id });
                        let kits = await reservationService.findKitReservedById(r.id);
                        kits = kits.map((kit) => { return kit.kit_id });
                        reservations.push({
                            id: r.id,
                            user_id: r.user_id,
                            loan_start: r.loan_start,
                            loan_end: r.loan_end,
                            items: items,
                            kits: kits
                        })
                    }
                    return res.status(200).json(reservations);
                } else {
                    let items = await reservationService.findItemReservedById(result[0].id);
                    items = items.map((item) => { return item.item_id });
                    let kits = await reservationService.findKitReservedById(userid);
                    kits = kits.map((kit) => { return kit.kit_id });
                    let reservation = {
                        id: result[0].id,
                        user_id: result[0].user_id,
                        loan_start: result[0].loan_start,
                        loan_end: result[0].loan_end,
                        items: items,
                        kits: kits
                    }
                    return res.status(200).json(reservation);
                }
            } else {
                return res.status(404).json({
                    message: "Reservation not found for user: " + userid
                });
            }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving reservation for user" + req.params.id
        })
    }
})

router.get('/item/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let itemid = req.params.id;
            let result = await reservationService.findByItemId(itemid);
            if(result && result.length > 0){
                return res.status(200).json(result);
            } else {
                return res.status(404).json({
                    message: "Item is currently not reserved"
                })
            }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving resrvation for item " + req.params.id
        })
    }
})

router.get('/kit/:id', async (req, res, next) => {
    try{
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let kitid = req.params.id;
            let result = await reservationService.findByKitId(kitid);
            if(result && result.length > 0){
                return res.status(200).json(result);
            } else {
                return res.status(404).json({
                    message: "Kit is currently not reserved or does not exist"
                })
            }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while retrieving resrvation for kit " + req.params.id
        })
    }
})

router.post('/email', async (req, res, next) =>{

    try{
        let type = req.body.type; //whether or not the email is for a reservation confirmation, checkout, or checkin
        let name = req.body.name; //the name of the recipent
        let email = req.body.email;
        let html = "<!DOCTYPE html><html><head><style> table, th, td {border: 1px solid black; border-collapse: collapse; }</style></head><body>";
        let header_str;
        let table_start;
        switch (type) {
            case "CONFIRMATION":
                header_str = "<p>Dear " + name + ", \n This email is to confirm your reservation: </p>";
                table_start = "<tr><th>Item</th><th>Start time</th><th>End time</th></tr>";
                html += header_str;
                html += table_start;
                req.body.reservation.forEach((i) => {
                    html += "<tr><td>" + i.name + "</td><td>" + i.loan_start  + "</td><td>" + i.loan_end + "</td></tr>";
                })
                html += "</table></body></html>";
                break;
            case "CHECKOUT":
                header_str = "<p>Dear " + name + ", \n This email is to confirm your item checkout: </p>";
                table_start = "<tr><th>Item</th><th>Checkout time</th></tr>";
                html += header_str;
                html += table_start;
                req.body.reservation.forEach((i) => {
                    html += "<tr><td>" + i.name + "</td><td>" + i.checkout_date + "</td></tr>";
                })
                html += "</table></body></html>";
                break;
            case "CHECKIN":
                header_str = "<p>Dear " + name + ", \n This email is to confirm your item checkin: </p>";
                table_start = "<tr><th>Item</th></tr>";
                html += header_str;
                html += table_start;
                req.body.reservation.forEach((i) => {
                    html += "<tr><td>" + i.name + "</td></tr>";
                })
                html += "</table></body></html>";
                break;
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'NO_REPLY -- ' + type,
            html: html
        };

        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);

        if(info.messageId){
            return res.status(200).send();
        } else {
            return res.status(500).send(reservationItemResult);
        }

    } catch (e){
        console.log(e);
        res.status(500).json({
            message: "Error occured while send email resrvation for user "
        })

    }
})


router.post('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let newreservation = req.body;
            // if(newreservation.user_id == req.session.user_id) {
                let result = await reservationService.create(newreservation);
                res.status(200).json({
                    id: result.insertId
                })
            // }
            // else {
            //     res.status(403).send();
            // }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while creating reservation"
        })
    }
})

router.post('/kit', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let newreservation = req.body;
            if(newreservation.user_id == req.session.user_id) {
                let result = await reservationService.createKitReservation(newreservation);
                return res.status(200).json({
                    id: result.insertId
                })
            } else {
                return res.status(403).send();
            }
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while creating reservation"
        })
    }
})

router.put('/kit', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let newreservation = req.body;
            // if(newreservation.user_id == req.session.user_id) {
                let result = await reservationService.updateKitReservation(newreservation);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Reservation updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Reservation not found/not updated"
                    })
                }
            // }
            // else {
            //     res.status(403).send();
            // }
        //}
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while updating reservation"
        })
    }
})

router.post('/kit/checkout', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            // if(req.session.role_id == 1){
                let reservation = req.body;
                let result = await reservationService.checkoutKitReservation(reservation);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Reservation deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Reservation not found"
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
            message: "Error occured while checking out"
        })
    }
})

router.delete('/kit/checkin/:id', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            // if(req.session.role_id == 1){
                let id = req.params.id;
                let result = await reservationService.deleteKitReservation(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Reservation deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Reservation not found"
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
            message: "Error occured while deleting reservation"
        })
    }
})

router.post('/checkout', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
        //     if(req.session.role_id == 1){
                let checkout = req.body;
                let result = await reservationService.findCheckoutByReservationId(checkout.reservation_id);
                if(result && result.length > 0){
                    return res.status(400).json({
                        message: "Reservation already checked out"
                    })
                }
                else{
                    result = await reservationService.checkoutItemReservation(checkout);
                    if(result.affectedRows == 1){
                        return res.status(200).json({
                            message: "Reservation checked out"
                        })
                    } else {
                        return res.status(404).json({
                            message: "Reservation not checked out"
                        })
                    }
                }
        //     }
        //     else {
        //         res.status(403).send();
        //     }
        // }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Error occured while checking out"
        })
    }
})

router.put('/', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            let newreservation = req.body;
            // if(newreservation.user_id == req.session.user_id) {
                let result = await reservationService.update(newreservation);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Reservation updated"
                    })
                } else {
                    return res.status(404).json({
                        message: "Reservation not found/not updated"
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
            message: "Error occured while updating reservation"
        })
    }
})

router.delete('/checkin/:id', async (req, res, next) => {
    try {
        // if(!req.session.auth){
        //     res.status(401).send();
        // }
        // else {
            // if(req.session.role_id == 1){
                // console.log(req.body);
                // let data = {
                //     checkout_id: req.body.checkout_id,
                //     reservation_id: req.body.reservation_id
                // }
                // console.log(data);
                const id = req.params.id;
                let result = await reservationService.deleteItemReservation(id);
                if(result.affectedRows == 1){
                    return res.status(200).json({
                        message: "Reservation deleted"
                    })
                } else {
                    return res.status(404).json({
                        message: "Reservation not found"
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
            message: "Error occured while deleting reservation"
        })
    }
})

router.delete('/:id', async (req, res, next) =>{
    try{
        let id = req.params.id;
        let result = await reservationService.deleteReservationById(id);
        if(result.affectedRows == 1){
            return res.status(200).json({
                message: "Reservation deleted"
            })
        } else {
            return res.status(404).json({
                message: "Reservation not found"
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error occured while deleting reservation"
        })
    }
})




module.exports = router;