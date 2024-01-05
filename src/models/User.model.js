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

    phone: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },


}, {
    timestamps: true
})

UserSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();

    bcrypt.hash(this.password, 8, (err, hash) => {
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