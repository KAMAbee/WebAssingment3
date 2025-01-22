//Import modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

//Middlewares
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Define User schema and model
const UserSchema = new mongoose.Schema({
    username: String,
    age: Number,
    email: String,
});

//Define User model
const User = mongoose.model('User', UserSchema);

//Add user
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/users');
});

//Read all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('index', { users: users });
});

//Delete user
app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});

//Update user
app.put('/users/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
});

//Search user by name
app.get('/users/search', async (req, res) => {
    const query = req.query.name;
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.render('index', { users: users });
});

//Sort users by age (ascending)
app.get('/users/sort', async (req, res) => {
    const users = await User.find().sort({ age: 1 });
    res.render('index', { users: users });
});

//Sort users by age (descending)
app.get('/users/sort/desc', async (req, res) => {
    const users = await User.find().sort({ age: -1 });
    res.render('index', { users: users });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/users`));
