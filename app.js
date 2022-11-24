const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { dirname } = require("path");
const { stringify } = require("querystring");
const { post } = require("request");


app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/8821585ea4!";
    const options = {
        method: "POST",
        auth: "jon1:3e60703af7b0762e0b2011677e185a46-us10",
    }


    const request = https.request(url, options, function(response) {
            
        var status = response.statusCode;
            if(status === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
            
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Port 3000 is not a glory hole.")
});

// API KEY 3e60703af7b0762e0b2011677e185a46-us10

// AUDIENCE ID 8821585ea4