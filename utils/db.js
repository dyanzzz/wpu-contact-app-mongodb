const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true    // agar ditambahkan index pada setiap document yg sudah di buat
});

// membuat schema
/* const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    hp: {
        type: String,
        required: true
    }
}) */

// menambah 1 data
/* const contact1 = new Contact({
    name: 'dodi',
    email: 'dodi@gmail.co.id',
    hp: '08188776655'
})

contact1.save().then((result) => console.log(result)) */