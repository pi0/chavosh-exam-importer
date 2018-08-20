  exports.exam = {
    key: 'exam',
    title: 'آزمون',
    fields: {
        std_number: {
        title: ['شماره دانشجو','شماره دانشجویی'
        ],
        type: 'string'
      },
      name: {
        title: 'نام دانشجو',
        type: 'string'
      },
      family_name: {
        title: 'نام خوانوادگی',
        type: 'string'
      },
      course_code: {
        title: 'کد درس',
        type: 'string'
      },
      course_name: {
        title: 'نام درس',
        type: 'string'
      },
      course_group: {
        title: 'گروه درس',
        type: 'string'
      },
      date: {
        title: 'تاریخ امتحان',
        type: 'date'
      },
      grade: {
        title: 'مقطع درس',
        type: 'string'
      },
       semester: {
        title: 'نیمسال',
        type: 'string'
      },
      prof_name: {
        title: 'نام استاد',
        type: 'string'
      },
      prof_family_name: {
        title: 'نام خانوادگی استاد',
        type: 'string'
      },
      seat: {
        title: ['شماره صندلی','صندلی'],
        type: 'string'
      },
      location: {
        title: 'محل برگزاری',
        type: 'string'
      },

    }
  }