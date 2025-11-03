const eventService = require("../services/eventService");

const addEvent = async (req, res, next) => {
    try {
        const response = await eventService.addEvent(req.body, req.user);

        res.status(201).json({
            success: true,
            message: "Event Added successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const listEvent = async (req, res, next) => {
    try {
        const response = await eventService.listEvent(req.query, req.user);

        res.status(201).json({
            success: true,
            message: "Event Getting successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const eventById = async (req, res, next) => {
    try {
        const response = await eventService.eventById(req.params.id, req.user);

        res.status(201).json({
            success: true,
            message: "Event Getting successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const updateEvent = async (req, res, next) => {
    try {
        const response = await eventService.updateEvent(req.params.id, req.body, req.user);

        res.status(201).json({
            success: true,
            message: "Event Added successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const bookEvent = async (req, res, next) => {
    try {
        const response = await eventService.bookEvent(req.body, req.user);

        res.status(201).json({
            success: true,
            message: "Event Booked successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const bookEventList = async (req, res, next) => {
    try {
        const response = await eventService.bookEventList(req.query, req.user);

        res.status(201).json({
            success: true,
            message: "Event Getting successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
}

const getGlobalAnalytics = async (req, res, next) => {
    try {
        const response = await eventService.getGlobalAnalytics(req.user);

        res.status(201).json({
            success: true,
            message: "Event Getting successfully",
            data: response,
        });

    } catch (error) {
        next(error); // forward to centralized error handler
    }
};

module.exports = {
    addEvent,
    listEvent,
    eventById,
    updateEvent,
    bookEvent,
    bookEventList,
    getGlobalAnalytics
}