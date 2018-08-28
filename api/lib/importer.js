'use strict'
var xlstojson = require("xls-to-json-lc")
var xlsxtojson = require("xlsx-to-json-lc")
const cors = require('cors')
const bodyparser = require('body-parser')
const csv = require('csvtojson')
var xlsx = require("xlsx")

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
}).single('file')

// app.use(cors())
// app.use(bodyparser.json())


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
};

async function imported(jsonArray) {
    var exam = {};
    var participants = [];
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
    
    
    
    for (var i = 0; i < jsonArray.length; i++) {
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
              console.log(dateform)
            }
            
        }
        

        participants.push({
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
    exam={
        course_code: courseC,
        course_name: courseN,
        date: dateform,
        level: vlevel,
        semester: vsem
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
