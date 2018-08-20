'use strict';
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const express = require('express');
const cors = require('cors')
const app = module.exports = express();
const bodyparser = require('body-parser');
const csv = require('csvtojson')
//const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = multer({ //multer settings
    dest: 'uploads/',
    fileFilter : function(req, file, callback) { //file filter
        if (['.xls', '.xlsx', '.csv'].indexOf(path.extname(file.originalname)) === -1) {
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
    res.json({error_code:0,err_desc:null, data: jsonArray});
}


app.post('/import', upload, async function (req, res) {

    switch (path.extname(req.file.originalname)) {
        case '.csv':
            const jsonArray = await csv().fromFile(req.file.path);
            imported(res, jsonArray);
            return;
    
        case '.xls':
            //exceltojson = xlsxtojson;
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
            break;
    
        case '.xlsx':
          //  exceltojson = xlstojson;
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
            break;
        default:
            res.json({error_code:1,err_desc:'Wrong file type', data: null});
            return;
    }

    // exceltojson({
    //     input: req.file.path,
    //     output: null, //since we don't need output.json
    //     lowerCaseHeaders:true
    // }, function(err,result){
    //     if(err) {
    //         return res.json({error_code:1,err_desc:err, data: null});
    //     }

    //     imported(res, jsonArray);
    // });
})