const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

//? middleware, setup engine EJS
// membuat instance template view EJS
app.set("view engine", "ejs");
// third party midleware
app.use(expressLayouts);
// build-in middleware
app.use(express.static('public'))
// build-in middleware urlencoded
app.use(express.urlencoded({ extended: true }))

//? configure flash
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

//? configure flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())

// setup method override
app.use(methodOverride('_method'))

//? all get method
// get all contact
app.get("/", (req, res) => {
    const mahasiswa = [
        {
            name: 'budi',
            email: 'budi@gmail.com',
            hp: '087771019856'
        }
    ];
  
    res.render("index", {
      name: "budii",
      title: "Home",
      layout: 'layouts/main-layout',
      mahasiswa: mahasiswa,
    });
});
  
// get contact by id
app.get("/contact", async (req, res) => {

    // jalanin/ ambil data tanpa async await
    /* Contact.find().then((contact) => {
        res.send(contact)
    }) */
  
    const contacts = await Contact.find()
  
    res.render("contact", {
      title: 'Contact',
      layout: 'layouts/main-layout',
      contacts,
      msg: req.flash('msg')
    });
});
  
// form add data contact
app.get("/contact/add", (req, res) => {
    res.render("add", {
      title: "Add Contact",
      layout: 'layouts/main-layout',
    })
})

// proses delete contact
/* app.get('/contact/delete/:name', async (req, res) => {
    //const contact = findContact(req.params.name)
    const contact = await Contact.findOne({
        name: req.params.name
    })
  
    if (!contact) {
      res.status(404)
      res.send('<h1>404</h1>')
    } else {
      //deleteContact(req.params.name)
      Contact.deleteOne({
          _id: contact._id
      }).then((result) => {
        req.flash('msg', 'Data contact berhasil dihapus')
        res.redirect('/contact')
      })
      
    }
}) */
app.delete('/contact', (req, res) => {
    Contact.deleteOne({
        name: req.body.name
    }).then((result) => {
      req.flash('msg', 'Data contact berhasil dihapus')
      res.redirect('/contact')
    })
})

// proses tambah data contact
app.post("/contact", 
  [
    body('name').custom( async (value) => {
      //const duplikatName = checkDuplicate(value)
      const duplikatName = await Contact.findOne({
          name: value
      })

      if(duplikatName) {
          throw new Error('Name already exist')
      }
      return true
    }),
    body('email', "Email tidak valid").isEmail(),
    body('hp', "No hp tidak valid").isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('add', {
        title: 'Form Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array()
      })
    } else {
      //addContact(req.body)
      Contact.insertMany(req.body, (error, result) => {
        // kirim message flash ke UI
        req.flash('msg', 'Data contact berhasil ditambahkan')
        res.redirect('/contact')
      })
    }
})

// route form edit data contact
app.get("/contact/edit/:name", async (req, res) => {
    //const contact = findContact(req.params.name)
    const contact = await Contact.findOne({
        name: req.params.name
    })
  
    res.render("edit", {
      title: "Form Edit Data Contact",
      layout: 'layouts/main-layout',
      contact
    })
})

/* app.post("/contact/update", 
  [
    body('name').custom((value, { req }) => {
      const duplikatName = checkDuplicate(value)

      if(value !== req.body.oldName && duplikatName) {
          throw new Error('Name already exist')
      }
      return true
    }),
    body('email', "Email tidak valid").isEmail(),
    body('hp', "No hp tidak valid").isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('edit', {
        title: 'Form Edit Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body
      })
    } else {
      //res.send(req.body)
      updateContact(req.body)
      // kirim message flash
      req.flash('msg', 'Data contact berhasil diubah')
      res.redirect('/contact')
    }
}) */
app.put("/contact", 
  [
    body('name').custom(async (value, { req }) => {
      // const duplikatName = checkDuplicate(value)
      const duplikatName = await Contact.findOne({
          name: value
      })

      if(value !== req.body.oldName && duplikatName) {
          throw new Error('Name already exist')
      }
      return true
    }),
    body('email', "Email tidak valid").isEmail(),
    body('hp', "No hp tidak valid").isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('edit', {
        title: 'Form Edit Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body
      })
    } else {
      //res.send(req.body)
      // updateContact(req.body)
      Contact.updateOne(
        {
            _id: req.body._id
        },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                hp: req.body.hp
            }
        }).then((result) => {
            // kirim message flash
            req.flash('msg', 'Data contact berhasil diubah')
            res.redirect('/contact')
        })
      
    }
})

  




// detail contact
app.get("/contact/:name", async (req, res) => {
    // const contact = findContact(req.params.name)
    const contact = await Contact.findOne({
        name: req.params.name
    })
    
    res.render("detail", {
      title: 'Detail Contact',
      layout: 'layouts/main-layout',
      contact
    });
});

app.listen(port, () => {
    console.log(`Mongo contact app | listen at http://localhost:${port}`)
})