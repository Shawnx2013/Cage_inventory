const express = require('express');
const router = express.Router();
const { checkoutService } = require('../services');

router.get('/', async (req, res, next) => {
    try{
        let result = await checkoutService.findAll();
        if(result && result.length > 0){
            let data = [];
            for (const r of result){
                let items = await checkoutService.findItemById(r.id);
                items = items.map((item) => { return item.item_id });
                let kits = await checkoutService.findKitById(r.id);
                kits = kits.map((kit) => { return kit.item_id });
                data.push({
                    id: r.id,
                    user_id: r.user_id,
                    reservation_id: r.reservation_id,
                    checkout_date: r.checkout_date,
                    items: items,
                    kits: kits,
                })
            }
            return res.status(200).json(data);
        } else {
            return res.status(200).json(result);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Error occured while retrieving check out data"
        })
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        let id = req.params.id;
        let result = checkoutService.findById(id);
        let items = await checkoutService.findItemById(result.id);
        items = items.map((item) => { return item.item_id });
        let kits = await checkoutService.findKitById(r.id);
        kits = kits.map((kit) => { return kit.item_id });
        let data = {
            id: r.id,
            user_id: r.user_id,
            reservation_id: r.reservation_id,
            checkout_date: r.checkout_date,
            items: items,
            kits: kits,
        }
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Error occured while retrieving check out data"
        })
    }
})

module.exports = router;