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

const im = require('./fields.js').exam;
let exam = im;
const field= {
    std_number: im.fields.std_number.title,
    name: im.fields.name.title,
    family_name: im.fields.family_name.title,
    course_code: im.fields.course_code.title,
    course_name: im.fields.course_name.title,
    date: im.fields.date.title,
    grade: im.fields.grade.title,
    semester: im.fields.semester.title,
    prof_name: im.fields.prof_name.title,
    prof_family_name: im.fields.prof_family_name.title,
    seat: im.fields.seat.title,//?
    location: im.fields.location.title,
};
function imported(res, jsonArray) {
    var array = [];
    console.log(jsonArray);
    res.json({error_code:0,err_desc:null, data: jsonArray});
    for (var i=0; i < jsonArray.length; i++) {
        array.push({
            std_number : jsonArray[i].im.fields.std_number.title,
            name : jsonArray[i].im.fields.name.title,
            family_name : jsonArray[i].im.fields.family_name.title,
            course_code : jsonArray[i].im.fields.course_code.title,
            course_name : jsonArray[i].im.fields.course_name.title,
            //date : jsonArray[i].exam.fields.date.title,
            grade : jsonArray[i].im.fields.grade.title,
            semester : jsonArray[i].im.fields.semester.title,
            prof_name : jsonArray[i].im.fields.prof_name.title,
            prof_family_name : jsonArray[i].im.fields.prof_family_name.title,
            seat : jsonArray[i].im.fields.seat.title,//?
            location : jsonArray[i].im.fields.location.title
        });
    }
    console.log(array);
    res.send({error_code:0,err_desc:'', data: array});
}




app.post('/import', upload, async function (req, res) {

    var exceltojson;
    
    switch (path.extname(req.file.originalname)) {
        case '.csv':
            const jsonArray = await csv().fromFile(req.file.path);
            imported(res, jsonArray);
            return;
    
        case '.xls':
            exceltojson = xlstojson;
        case '.xlsx':
            exceltojson = xlsxtojson;
            break;
        default:
            res.json({error_code:1,err_desc:'Wrong file type', data: null});
            return;
    }

    exceltojson({
        input: req.file.path,
        output: null, //since we don't need output.json
        lowerCaseHeaders:true
    }, function(err,result){
        if(err) {
            return res.json({error_code:1,err_desc:err, data: null});
        }

        imported(res, result);
    });
})