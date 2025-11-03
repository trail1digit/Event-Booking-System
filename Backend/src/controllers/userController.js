const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const response = await userService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
};

const login = async (req, res, next) => {
  try {
    const response = await userService.login(req.body);

    res.status(201).json({
      success: true,
      message: "User Login successfully",
      data: response,
    });

  } catch (error) {
    next(error); // forward to centralized error handler
  }
}

module.exports = {
    register,
    login
}

