'use strict';
const excelToJson = require('convert-excel-to-json');
const express = require('express');
const cors = require('cors')
const app = module.exports = express();
const bodyparser = require('body-parser');
const fs = require('fs');
const csv = require('csvtojson')
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
// const upload = multer({
//   dest: 'uploads/'
// });
var sheetToJson = require('csv-xlsx-to-json');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');




app.use(cors())

app.listen(3001, function () {
    console.log('listening on 3001')
})

app.use(bodyparser.json());


function imported(res, jsonArray) {
    console.log(jsonArray);
    res.send('ok');
}


app.post('/import', async function (req, res) {
    


         
       
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if(req.file.path.split('.')[req.file.path.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            if (req.file.path.split('.')[req.file.path.split('.').length-1] === '.csv') {
       
                const jsonArray = await csv().fromFile(req.file.path);
                imported(res, jsonArray);
             
            
         }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    }
                    res.json({error_code:0,err_desc:null, data: result});
                    console.log(result)
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
           
        })

       
     
    //     case '.xslx':
    //         sheetToJson.process(req.file.path, function(err, jsonArray){
    //             if(err){
    //                 res.send('failed');
    //                 return;
    //             }
            
    //             imported(res, jsonArray);
    //         });
    //         break;
    //     default:
    //         break;
     
})