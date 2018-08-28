exports.exam = {
  key: 'exam',
  title: 'آزمون',
  fields: {
    std_number: {
      title: ['شماره دانشجو', 'شماره دانشجویی'],
      type: 'string'
    },
    std_name: {
      title: ['نام دانشجو'],
      type: 'string'
    },
    std_family_name: {
      title: ['نام خوانوادگی', 'نام خانوادگی دانشجو'],
      type: 'string'
    },
    course_code: {
      title: ['کد درس'],
      type: 'string'
    },
    course_name: {
      title: ['نام درس'],
      type: 'string'
    },
    course_group: {
      title: ['گروه درس'],
      type: 'string'
    },
    date: {
      title: ['تاریخ امتحان'],
      type: 'date'
    },
    level: {
      title: ['مقطع درس'],
      type: 'string'
    },
    semester: {
      title: ['نیمسال'],
      type: 'string'
    },
    prof_name: {
      title: ['نام استاد'],
      type: 'string'
    },
    prof_family_name: {
      title: ['نام خانوادگی استاد', 'نام خانوادگی'],
      type: 'string'
    },
    seat: {
      title: ['شماره صندلی', 'صندلی'],
      type: 'string'
    },
    location: {
      title: ['محل برگزاری'],
      type: 'string'
    }

  }
}
