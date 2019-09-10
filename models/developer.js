const mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        uppercase: true,
        required: true,
        validate: {
            validator: function (levelValue){
                return levelValue === "BEGINNER" || levelValue === "EXPERT";
            },
            message: 'Level should be either "Beginner" or "Expert"'
        }
    },
    address: {
        state:{
            type: String
        },
        suburb:{
            type: String
        },
        street:{
            type: String
        },
        unit:{
            type: Number
        }
    }
});

module.exports = mongoose.model('Developer', developerSchema);