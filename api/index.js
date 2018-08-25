'use strict';
const express = require('express');
const cors = require('cors')
const app = module.exports = express();
const bodyparser = require('body-parser');
app.use(cors());

app.listen(3001, function () {
    console.log('listening on 3001')
})

app.use(bodyparser.json());

const{ getfile , upload} = require('./lib/importer');

app.post('/import', upload ,async function(req,res){
    res.sendStatus(200);
    
    const array= await getfile(req.file );
    console.log(array ,"must wait");
      
})
<<<<<<< HEAD
//test
=======
//test
>>>>>>> 52b94379f160a18ae46bf3bf097fcf1ad25f2c53
