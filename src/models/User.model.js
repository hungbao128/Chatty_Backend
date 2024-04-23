const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    bio: {
        type: String,
        default: ''
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },

    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/diribdgsz/image/upload/v1704685598/chat-app/clone-avatar_a6lb3y.png'
    },

    background:{
        type: String,
        default: 'https://res.cloudinary.com/diribdgsz/image/upload/v1704685988/chat-app/clone-background_bb1l7i.png'
    }
}, {
    timestamps: true
})

UserSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();

    bcrypt.hash(this.password, 10, (err, hash) => {
        if(err) return next(err);

        this.password = hash;
        next();
    })
})

UserSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compareSync(candidatePassword, this.password);
}

const UserModel = model("User", UserSchema);

module.exports = UserModel;