'use strict'
const express = require('express')
const cors = require('cors')
const app = module.exports = express()
const bodyparser = require('body-parser')
var mongoose = require('mongoose')
const { getfile, upload} = require('./lib/importer')
const {
  Exam
} = require('./exam')

app.use(cors())

app.listen(3001, function () {
  console.log('listening on 3001')
})

app.use(bodyparser.json())

app.post('/import', upload, async function (req, res) {
  res.sendStatus(200)

  const exam = await getfile(req.file)

  var newExam = await new Exam({
    course_code: exam.exam.course_code,
    course_name: exam.exam.course_name,
    date: exam.exam.date,
    level: exam.exam.level,
    semester: exam.exam.semester,
    participants: exam.participants
  })
  newExam.save(function (error) {
    if (error) { console.log(error) }
  })
})
