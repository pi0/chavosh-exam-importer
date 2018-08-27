'use strict';
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const express = require('express');
const cors = require('cors')
const app = module.exports = express();
const bodyparser = require('body-parser');
const csv = require('csvtojson')
const path = require('path');
const multer = require('multer');
const upload = multer({ //multer settings
    dest: 'uploads/',
    fileFilter: function (req, file, callback) { //file filter
        if (['.xls', '.xlsx', '.csv'].indexOf(path.extname(file.originalname)) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

app.use(cors())

var myExam = {};

app.use(bodyparser.json());

const im = require('../fields').exam;
const field = {
    course_code: im.fields.course_code.title,
    course_name: im.fields.course_name.title,
    
    date: im.fields.date.title,
    level: im.fields.level.title,
    semester: im.fields.semester.title, 
    participent:{
        std_name: im.fields.std_name.title,
        std_family_name: im.fields.std_family_name.title,
        std_number: im.fields.std_number.title,
        seat: im.fields.seat.title,
        location: im.fields.location.title,
        prof_name: im.fields.prof_name.title,
        prof_family_name: im.fields.prof_family_name.title,
        course_group: im.fields.course_group.title,
    
    }
};

async function imported(jsonArray) {
    var array = [];
    var participents = [];
    var fname = "";
    var stdno = "";
    var profname = "";
    var seatno = "";
    var dateform = "";
    
    
    var stdname ="";
    var courseC = "";
    var courseG = "";
    var courseN = "";
    var vlevel = "";
    var pname = "";
    var vsem = "";
    var vloc = "";
    
    
    
    for (var i = 0; i < jsonArray.length; i++) {
        for (let index = 0; index < field.participent.std_name.length; index++) {
            if (jsonArray[i][field.participent.std_name[index]] != undefined) {
                stdname = jsonArray[i][field.participent.std_name[index]];
            }
        }
        for (let index = 0; index < field.course_name.length; index++) {
            if (jsonArray[i][field.course_name[index]] != undefined) {
                courseN = jsonArray[i][field.course_name[index]];
            }
        }
        for (let index = 0; index < field.course_code.length; index++) {
            if (jsonArray[i][field.course_code[index]] != undefined) {
                courseC = jsonArray[i][field.course_code[index]];
            }
        }
        for (let index = 0; index < field.participent.course_group.length; index++) {
            if (jsonArray[i][field.participent.course_group[index]] != undefined) {
                courseG = jsonArray[i][field.participent.course_group[index]];
            }
        }
        for (let index = 0; index < field.level.length; index++) {
            if (jsonArray[i][field.level[index]] != undefined) {
                vlevel = jsonArray[i][field.level[index]];
            }
        }
        for (let index = 0; index < field.participent.prof_name.length; index++) {
            if (jsonArray[i][field.participent.prof_name[index]] != undefined) {
                pname = jsonArray[i][field.participent.prof_name[index]];
            }
        }
        for (let index = 0; index < field.semester.length; index++) {
            if (jsonArray[i][field.semester[index]] != undefined) {
                vsem = jsonArray[i][field.semester[index]];
            }
        }
        for (let index = 0; index < field.participent.location.length; index++) {
            if (jsonArray[i][field.participent.location[index]] != undefined) {
                vloc = jsonArray[i][field.participent.location[index]];
            }
        }
        





        for (let index = 0; index < field.participent.std_family_name.length; index++) {
            if (jsonArray[i][field.participent.std_family_name[index]] != undefined) {
                fname = jsonArray[i][field.participent.std_family_name[index]];
            }
        }
        for (let index = 0; index < field.participent.std_number.length; index++) {
            if (jsonArray[i][field.participent.std_number[index]] != undefined) {
                stdno = jsonArray[i][field.participent.std_number[index]];
            }
        }
        for (let index = 0; index < field.participent.prof_family_name.length; index++) {
            if (jsonArray[i][field.participent.prof_family_name[index]] != undefined) {
                profname = jsonArray[i][field.participent.prof_family_name[index]];
            }
        }
        for (let index = 0; index < field.participent.seat.length; index++) {
            if (jsonArray[i][field.participent.seat[index]] != undefined) {
                seatno = jsonArray[i][field.participent.seat[index]];
            }
        }
        
        for (let index = 0; index < field.date.length; index++) {
            if (jsonArray[i][field.date[index]] != undefined) {
                var arr = [];
                arr = jsonArray[i][field.date].split("/");
                dateform = arr[0] + "-" + arr[1] + "-" + arr[2];
            }
            
        }
        

        participents.push({
                std_name: stdname,
                std_family_name: fname,
                std_number: stdno,
                seat: seatno,
                location: vloc,
                prof_name: pname,
                prof_family_name: profname,
                course_group: courseG
            
        });
    }
    array.push({
        course_code: courseC,
        course_name: courseN,
        date: dateform,
        level: vlevel,
        semester: vsem
        });
    
    return {array,participents};
  
    
}


async function getfile(file) {

    return new Promise(async (resolve, reject) => {

        var exceltojson;

        switch (path.extname(file.originalname)) {
            case '.csv':
                const jsonArray = await
                csv().fromFile(file.path);
                //console.log(jsonArray);
                myExam = await imported(jsonArray);
                resolve(myExam);
                return;

            case '.xls':
                exceltojson = xlstojson;
                break;
            case '.xlsx':
                exceltojson = xlsxtojson;
                break;
            default:
                resolve(0);
                return;
        }

        exceltojson({
            input: file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders: true
        }, async function (err, result) {
            if (err) {
                return err;
            }
            myExam = await imported(result);
            resolve(myExam);
            return;
        });

    });
}

module.exports = {
    getfile, upload
}
