const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = require('./db/session');
const cors = require('cors');
const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(cookieParser());

// app.use(session({
//     name: 'cage_session',
//     secret: 'some secret',
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 3600000,
//     }
// }))

app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/api/item', routes.itemRoute);
app.use('/api/user', routes.userRoute);
app.use('/api/item-tag', routes.itemTagRoute);
app.use('/api/location', routes.locationRoute);
app.use('/api/reservation', routes.reservationRoute);
app.use('/api/kit', routes.kitRoute);
app.use('/api/checkout', routes.checkoutRoute);
app.use('/api/role', routes.roleRoute);

app.get('/', (req, res) => {
    res.send({msg:"API ROOT"});
})

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`Server started on port ${process.env.SERVER_HOST}.`);
    console.log(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/`);
});

