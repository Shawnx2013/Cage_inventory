const services = {
    itemService: require('./item.service'),
    itemTagService: require('./item_tag.service'),
    roleService: require('./role.service'),
    userService: require('./user.service'),
    locationService: require('./locationService'),
    reservationService: require('./reservationService'),
    kitService: require('./kit.service'),
    checkoutService: require('./checkoutService'),
    //Add other services here
}

module.exports = services;