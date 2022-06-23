// require learnosity sdk
const Learnosity = require('learnosity-sdk-nodejs');
// 3 other required dependencies for this example: (express, form-data, axios)
const express = require('express');
const FormData = require('form-data')
const axios = require('axios');

const app = express();


// setting up a DATA API route using axios and express

// initialize a get express route (to reflect that the action is 'get')
// you can call this route anything you want - called learnosity-activities here to reflect that you want to get
// your activities form Learnosity
// use async await to await the response from the request to leanrosity 
app.get('/learnosity-activities', async (req, res) => {
    // instantiate the SDK
    const learnositySdk = new Learnosity();
    // Generate a Learnosity API initialization packet to the DataAPI
    const dataAPIRequest = learnositySdk.init(
        // service type
        'data',

        // security details - dataAPIRequest.security 
        {
            'consumer_key': 'yis0TYCu7U9V4o7M', // your actual consumer key here 
            'domain':       'localhost', // your actual domain here
            'user_id':      '1234567' // your user id
        },
        // secret 
        '74c5fd430cf1242a527f6223aebd42d30464be22', // your actual consumer secret here
        // request details - build your request object for the Data API here - dataAPIRequest.request
        // this example fetches activities from our demos item bank w/ the following references
        {
            references : ["19935",
            "00082a84-0a72-45bf-b465-e9e54b6094bc",
            "7656ffc0-2cad-4cf0-884f-946cbb9a4bad"]
        },
         // action type - dataAPIRequest.action
         'get'
    );
    
    // use the form data npm package to append the initilization packet to the from object to be used in the axios request below
    const form = new FormData();
    form.append("security", dataAPIRequest.security);
    form.append("request", dataAPIRequest.request);
    form.append("action", dataAPIRequest.action);


    // now make a POST request to the desired endpoint of Data API using axios, including the form data in the post request  
    // using 'await' save the successful response to a variable called dataAPIResponse
    const dataAPIResponse = await axios.post('https://data.learnosity.com/v2022.1.LTS/itembank/activities', form, {
    headers: form.getHeaders()
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    return res.data;
  })
  .catch(error => {
    console.log(error);
  })

  // log the pretified response to the console using JSON.stringify
  console.log("response from the data API", JSON.stringify(dataAPIResponse, null, '\t'))
  // send the response on using the express res.send() method. 
  res.send(dataAPIResponse)
});

// generic message
app.get('/', (req,res) => {
  res.send("welcome to the NodeSDK + Express + DataAPI example. Go to /learnosity-activities to fetch the data")
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});