const User = require("../models/Users");
const Permission = require("../models/permission");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(data) {
    try {
        const { role_id, name, address, email, password, phoneno } = data;

        if (!email || !password || !name) {
            const error = new Error("Name, email, and password are required");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Email already registered");
            error.statusCode = 409;
            throw error;
        }

        const user = new User({
            role_id,
            name,
            address,
            email,
            password,
            phoneno,
        });

        await user.save();

        return {
            id: user._id,
            name: user.name,
            email: user.email,
        };

    } catch (err) {
        throw err;
    }
}

async function login(data) {
    try {
        const { email, password } = data;

        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user._id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const permissionData = await Permission.find({ role_id: user.role_id }).populate([
            { path: "role_id" }, { path: "module_id" },
        ]);
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            permissions: permissionData
        };
    } catch (err) {
        throw err;
    }
}


module.exports = {
    register,
    login
}