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
    seat: im.fields.seat.title,
    location: im.fields.location.title,
};

async function imported(jsonArray) {
    var array = [];
    var fname = "";
    var stdno = "";
    var profname = "";
    var seatno = "";
    var dateform = "";

    for (var i = 0; i < jsonArray.length; i++) {
        for (let index = 0; index < field.family_name.length; index++) {
            if (jsonArray[i][field.family_name[index]] != undefined) {
                fname = jsonArray[i][field.family_name[index]];
            }
        }
        for (let index = 0; index < field.std_number.length; index++) {
            if (jsonArray[i][field.std_number[index]] != undefined) {
                stdno = jsonArray[i][field.std_number[index]];
            }
        }
        for (let index = 0; index < field.prof_family_name.length; index++) {
            if (jsonArray[i][field.prof_family_name[index]] != undefined) {
                profname = jsonArray[i][field.prof_family_name[index]];
            }
        }
        for (let index = 0; index < field.seat.length; index++) {
            if (jsonArray[i][field.seat[index]] != undefined) {
                seatno = jsonArray[i][field.seat[index]];
            }
        }

        var arr = [];
        arr = jsonArray[i][field.date].split("/");
        dateform = arr[0] + "-" + arr[1] + "-" + arr[2];

        array.push({
            std_number: stdno,
            name: jsonArray[i][field.name],
            family_name: fname,
            course_code: jsonArray[i][field.course_code],
            course_name: jsonArray[i][field.course_name],
            date: dateform,
            grade: jsonArray[i][field.grade],
            semester: jsonArray[i][field.semester],
            prof_name: jsonArray[i][field.prof_name],
            prof_family_name: profname,
            seat: seatno,
            location: jsonArray[i][field.location]
        });
    }
    return array;
}


async function getfile(file) {

    return new Promise(async (resolve, reject) => {

        var exceltojson;

        switch (path.extname(file.originalname)) {
            case '.csv':
                const jsonArray = await
                csv().fromFile(file.path);
                console.log(jsonArray);
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