const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://" + process.env.DB_USER_PASS + "@devus.kb3xzpd.mongodb.net/DevUs",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log("Failed to connect ot MongoDB", err));