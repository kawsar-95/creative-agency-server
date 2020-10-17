const express = require('express')
const app = express()
const fs = require('fs-extra')
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dq44d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("creative-agency").collection("orders");
    const allServiceCollection = client.db("allService").collection("allService");
    const newServiceCollection = client.db("newServiceCollection").collection("newServiceCollection");
    const allFeedbackCollection = client.db("allFeedback").collection("allFeedback");
    const adminCollection = client.db("adminList").collection("adminList");
    app.post("/placeOrder", (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                console.log("Order Added")
                res.send(result.insertedCount > 0)

            })

    })

    app.post("/addAdmin", (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                console.log("Admin Added")
                res.send(result.insertedCount > 0)

            })

    })
    app.post("/placeReview", (req, res) => {
        const review = req.body;
        allFeedbackCollection.insertOne(review)
            .then(result => {
                console.log("Review Added")
                res.send(result.insertedCount > 0)

            })

    })
    app.post('/addAllServices', (req, res) => {
        const services = req.body;
        allServiceCollection.insertMany(services)
            .then(result => {
                console.log(result);
            })

    })

    app.post('/addAllFeedbacks', (req, res) => {
        const feedbacks = req.body;
        allFeedbackCollection.insertMany(feedbacks)
            .then(result => {
                console.log(result);
            })

    })
    app.get("/services", (req, res) => {
        allServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })


    })
    app.get("/addNewService", (req, res) => {
        newServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })


    })
    app.get("/getServiceList", (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })


    })

    app.get("/feedbacks", (req, res) => {
        allFeedbackCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })


    })
    app.get("/serviceList", (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })


    })
    app.get("/filterAdmin", (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                if (documents.length > 0) {
                    console.log("You are admin")
                    res.send(documents)
                };
            })


    })

    app.post('/addAService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const details = req.body.details;
        console.log(name, details, file);

        const newImg =file.data;
        const encImg = newImg.toString('base64');

        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')

        }

        newServiceCollection.insertOne({ name, details, image })

            .then(result => {

                res.send(result.insertedCount > 0)

    })
})


});



app.listen(process.env.PORT || port)