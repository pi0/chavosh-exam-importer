'use strict'
var xlstojson = require("xls-to-json-lc")
var xlsxtojson = require("xlsx-to-json-lc")
const cors = require('cors')
const bodyparser = require('body-parser')
const csv = require('csvtojson')
const path = require('path')
const multer = require('multer')
var moment = require('moment-jalaali')
const im = require('../fields').exam

const upload = multer({ //multer settings
    dest: 'uploads/',
    fileFilter: function (req, file, callback) { //file filter
        if (['.xls', '.xlsx', '.csv'].indexOf(path.extname(file.originalname)) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file') //multer is used to add file in a directory

var myExam = {}

const field = {
    course_code: im.fields.course_code.title,
    course_name: im.fields.course_name.title,
    
    date: im.fields.date.title,
    level: im.fields.level.title,
    semester: im.fields.semester.title, 
    participant:{
        std_name: im.fields.std_name.title,
        std_family_name: im.fields.std_family_name.title,
        std_number: im.fields.std_number.title,
        seat: im.fields.seat.title,
        location: im.fields.location.title,
        prof_name: im.fields.prof_name.title,
        prof_family_name: im.fields.prof_family_name.title,
        course_group: im.fields.course_group.title,
    
    }
}; // filed is used to access the the name of the fields in excel file

async function imported(jsonArray) {
    var exam = {};
    var participants = [];
  
  for (var i = 0; i < jsonArray.length; i++) { 

        participants.push({
                std_name:content(i, jsonArray, field).stdname,
                std_family_name:content(i, jsonArray, field).fname,
                std_number: content(i, jsonArray, field).stdno,
                seat: content(i, jsonArray, field).seatno,
                location: content(i, jsonArray, field).vloc,
                prof_name: content(i, jsonArray, field).pname,
                prof_family_name: content(i, jsonArray, field).profname,
                course_group: content(i, jsonArray, field).courseG 
        });
    }
    const stcontent = content(2, jsonArray, field);
    exam={
        course_code: stcontent.courseC,
        course_name: stcontent.courseN,
        date: stcontent.dateform,
        level: stcontent.vlevel,
        semester: stcontent.vsem
        };
    
    return {exam,participants};
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

//function is used for reading row elements of the excel file

function content(i, jsonArray, field){

  // these variables are used to get the content in rows of excel file
    var fname = "";
    var stdno = "";
    var profname = "";
    var seatno = "";
    var dateform = "";
    var datef = "";
    var stdname ="";
    var courseC = "";
    var courseG = "";
    var courseN = "";
    var vlevel = "";
    var pname = "";
    var vsem = "";
    var vloc = "";

  //loops are for reading row elements with correct feild name
    for (let index = 0; index < field.participant.std_name.length; index++) {
        if (jsonArray[i][field.participant.std_name[index]] != undefined) {
            stdname = jsonArray[i][field.participant.std_name[index]];
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
    for (let index = 0; index < field.participant.course_group.length; index++) {
        if (jsonArray[i][field.participant.course_group[index]] != undefined) {
            courseG = jsonArray[i][field.participant.course_group[index]];
        }
    }
    for (let index = 0; index < field.level.length; index++) {
        if (jsonArray[i][field.level[index]] != undefined) {
            vlevel = jsonArray[i][field.level[index]];
        }
    }
    for (let index = 0; index < field.participant.prof_name.length; index++) {
        if (jsonArray[i][field.participant.prof_name[index]] != undefined) {
            pname = jsonArray[i][field.participant.prof_name[index]];
        }
    }
    for (let index = 0; index < field.semester.length; index++) {
        if (jsonArray[i][field.semester[index]] != undefined) {
           vsem = jsonArray[i][field.semester[index]];
        }
    }
    for (let index = 0; index < field.participant.location.length; index++) {
        if (jsonArray[i][field.participant.location[index]] != undefined) {
            vloc = jsonArray[i][field.participant.location[index]];
        }
    }

    for (let index = 0; index < field.participant.std_family_name.length; index++) {
        if (jsonArray[i][field.participant.std_family_name[index]] != undefined) {
            fname = jsonArray[i][field.participant.std_family_name[index]];
        }
    }
    for (let index = 0; index < field.participant.std_number.length; index++) {
        if (jsonArray[i][field.participant.std_number[index]] != undefined) {
            stdno = jsonArray[i][field.participant.std_number[index]];
        }
    }
    for (let index = 0; index < field.participant.prof_family_name.length; index++) {
        if (jsonArray[i][field.participant.prof_family_name[index]] != undefined) {
            profname = jsonArray[i][field.participant.prof_family_name[index]];
        }
    }
    for (let index = 0; index < field.participant.seat.length; index++) {
        if (jsonArray[i][field.participant.seat[index]] != undefined) {
            seatno = jsonArray[i][field.participant.seat[index]];
        }
    }
    for (let index = 0; index < field.date.length; index++) {
        if (jsonArray[i][field.date[index]] != undefined) {
          dateform =  moment(jsonArray[i][field.date[index]], 'jYYYY/jM/jD').format('YYYY-M-D')
        }
    }
    return{fname, stdno, profname, seatno, dateform, datef,
         stdname, courseC, courseG, courseN, vlevel, pname, vsem, vloc}
}