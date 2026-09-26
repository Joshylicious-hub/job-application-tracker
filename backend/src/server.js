require('dotenv').config({ path: '../.env' });
require('./config/db');
const app = require('./app');


app.listen(process.env.PORT, () => {
    console.log('Connected to http://localhost:3000');
})