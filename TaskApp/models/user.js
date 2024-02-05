const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            default: 0,
            validate(value) {
                if (value < 13) {
                    throw new Error("You have to be at least 13 y.o.")
                }
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value))
                    throw new Error("Email is not valid!");
            }
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (value.length < 8 || value === "password")
                    throw new Error("Password is not valid! At least 8 characters required.");
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }, {
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    }
);

userSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({email});
    if (user)
        return user;

    return undefined;
}

userSchema.statics.findOneByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error("No user with this email!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Incorrect password!");
    }
    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'tokenKey');
    user.tokens = user.tokens.concat({token});

    await user.save();

    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const User = mongoose.model("User", userSchema);

module.exports = User;