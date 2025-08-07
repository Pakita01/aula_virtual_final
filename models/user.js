const { default: mongoose } = require('mongoose');
const monggoose= require('mongoose');

const userSchema = new monggoose.Schema({
    name:  String,  
    email:  String,
    passwordHash: String,
    verified:{
        type:Boolean,
        default:false
    },  
    todos: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    }]
});

 userSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // No enviar el hash de la contraseña
    }
});

const User = mongoose.model('User',userSchema);
module.exports = User;