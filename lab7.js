let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');

const mongoose = require('mongoose');

const Task = require('./models/task.js');

const Developer = require('./models/developer.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('common'));

//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));

// parse application/json
app.use(bodyParser.json())

app.listen(8080);

mongoose.connect('mongodb://localhost:27017/taskDB', function (err){
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
    
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/views/index.html');
    });

});

//Add new developer to collection
app.get('/newDeveloper', function (req, res) {
    res.sendFile(__dirname + '/views/newDeveloper.html');
});

app.post('/newDeveloper', function (req, res) {
    
    let developerDetails = req.body;

    let developer1 = new Developer({
        name: {
            firstName: developerDetails.firstname,
            lastName: developerDetails.lastname
        },
        level: developerDetails.developerlevel,
        address: {
            state: developerDetails.state,
            suburb: developerDetails.suburb,
            street: developerDetails.street,
            unit: developerDetails.unit
        }
    });

    developer1.save(function (err) {
        if (err) throw err;
        console.log('Developer Successfully Added to DB');
        res.redirect('/allDevelopers');
        /*
        app.get('/newTasks', function (req, res) {
            res.sendFile(__dirname + '/views/newTasks.html');
        });
        
        app.post('/newTasks', function (req, res) {
            
            let taskDetails = req.body;
        
            let task1 = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: taskDetails.taskname,
                assign_to: developer1._id,
                due_date: taskDetails.taskduedate,
                task_status: taskDetails.taskstatus,
                task_description: taskDetails.taskdescription
            });
        
            task1.save(function (err){
                if (err) throw err;
                console.log('Task Successfully Added to DB');
        
            });
        
            res.redirect('/listTasks');
        
        });
    
    */
    });

});

//List developers in table
app.get('/allDevelopers', function (req, res) {

    Developer.find({}, function (err, docs) {
        res.render('allDevelopers.html', {developerCol: docs})
      });
});


//Add new task
app.get('/newTasks', function (req, res) {
    res.sendFile(__dirname + '/views/newTasks.html');
});

app.post('/newTasks', function (req, res) {
    
    let taskDetails = req.body;
    var taskId = Math.round(Math.random()*1000);

    let task1 = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: taskDetails.taskname,
        assign_to: new mongoose.Types.ObjectId(),
        due_date: taskDetails.taskduedate,
        task_status: taskDetails.taskstatus,
        task_description: taskDetails.taskdescription
    });

    task1.save(function (err){
        if (err) throw err;
        console.log('Task Successfully Added to DB');

    });

    res.redirect('/listTasks');

});


//List tasks in table
app.get('/listTasks', function (req, res) {
    Task.find({}, function (err, docs) {
        res.render('listTasks.html', {taskCol: docs})
      });
});

//Delete task
app.get('/deleteTasks', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTasks.html');
});

app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { _id: taskDetails.taskid };
    //db.collection('tasks').deleteOne(filter);
    //res.redirect('/listTasks');

    Task.deleteOne(filter, function (err, doc){});
    res.redirect('/listTasks');
});

//Delete all completed tasks
app.get('/deleteOldComplete', function(req, res){
    let filter = { 'task_status': "Complete", 'due_date': {$gt: "2019-09-10"} };

    Task.deleteMany(filter, function (err, doc){});
    res.redirect('/listTasks');
});

//Update task
app.get('/updateTasks', function (req, res) {
    res.sendFile(__dirname + '/views/updateTasks.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { '_id': taskDetails.taskid };
    let theUpdate = { $set: { 'task_status': taskDetails.newstatus } };
    Task.updateOne(filter, theUpdate, function (err, doc){});
    res.redirect('/listTasks');
});

app.get('/completedTasks', function (req, res){
    Task.where('task_status').equals('Complete').limit(3).sort('name').exec()
})


//////////////////////////////////////
/*
let express = require('express');
let mongodb = require("mongodb");
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('common'));

//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));

// parse application/json
app.use(bodyParser.json())

app.listen(8080);

//Configure MongoDB
const MongoClient = mongodb.MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/";

//reference to the database (i.e. collection)
let db;

//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) {
        console.log("Err  ", err);
    } else {
        console.log("Connected successfully to server");
        db = client.db("fit2095db");
        db.collection('tasks');
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/newTasks', function (req, res) {
    res.sendFile(__dirname + '/views/newTasks.html');
});

//Add new task to table
app.post('/newTasks', function (req, res) {
    
    let taskDetails = req.body;
    var taskId = Math.round(Math.random()*1000);
    
    db.collection('tasks').insertOne({id: taskId, name: taskDetails.taskname, assignedto: taskDetails.assignedto, duedate: taskDetails.taskduedate, status: taskDetails.taskstatus, description: taskDetails.taskdescription});
    res.redirect('/listTasks');

});

//List tasks in table
app.get('/listTasks', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data){
        res.render('listTasks.html', { taskDb: data });
    });
});

//Delete task
app.get('/deleteTasks', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTasks.html');
});

app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.taskid) };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listTasks');
});

//Update task
app.get('/updateTasks', function (req, res) {
    res.sendFile(__dirname + '/views/updateTasks.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.taskid) };
    let theUpdate = { $set: { status: taskDetails.newstatus } };
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/listTasks');// redirect the client to list users page
});

//Delete all completed tasks
app.get('/deleteOldComplete', function(req, res){
    let filter = { status: "Complete", duedate: {$gt: "2019-09-10"} };
    
    db.collection('tasks').deleteMany(filter);
    res.redirect('/listTasks');
});

*/