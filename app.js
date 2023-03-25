const express = require('express');                                 //01
const path = require('path');                                       //06
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');                          //34

const Campground = require('./models/campground');                  //10

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {           //07
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;                                     //08
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');                                      //04
app.set('views', path.join(__dirname, 'views'))

//
app.use(express.urlencoded({ extended: true }));                    //26
app.use(methodOverride('_method'));                                             //35
//

app.get('/', (req, res) => {                                        //02
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {                       //09        //18
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })                //20
});

//

app.get('/campgrounds/new', (req, res) => {                         //24
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {                      //27
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res,) => {                  //21
    const campground = await Campground.findById(req.params.id)     //22
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {              //29
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {                   //36
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {                //38
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
