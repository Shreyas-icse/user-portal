require("dotenv").config();

const app = require('express')();
const http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');

app.use('/', paymentRoute);

const PORT = 9000;

http.listen(PORT, function () {
    console.log(`Server is running at: http://localhost:${PORT}`);
});
