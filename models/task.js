const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    assign_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    due_date: {
        type: Date,
        default: Date.now
    },
    task_status: {
        type: String,
        required: true,
        validate: {
            validator: function(statusValue){
                return statusValue === "inProgress" || statusValue === "Complete";
            },
            message: 'Status should either be inProgress or Complete'
        }
    },
    task_description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);