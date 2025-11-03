const Event = require("../models/Event");
const BookedEvent = require("../models/BookedEvent");
const User = require("../models/Users");
const mongoose = require("mongoose");

async function addEvent(data, user) {
  try {
    const { title, category, venue, date, totalSeats, availableSeats, price } =
      data;

    const newEvent = new Event({
      title,
      category,
      organizerId: user.id,
      venue,
      date,
      totalSeats,
      availableSeats,
      price,
    });

    const savedEvent = await newEvent.save();
    return savedEvent;
    // return { success: true, message: "Event added successfully", data: savedEvent };
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

async function listEvent(query, user) {
  try {
    const { organizerId, status, category, page, limit } = query;

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));

    const filter = {};
    if (organizerId) filter.organizerId = organizerId;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const totalEvents = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .populate("organizerId")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return {
      success: true,
      total: totalEvents,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(totalEvents / pageSize),
      count: events.length,
      data: events,
    };
  } catch (error) {
    console.error("Error listing events:", error);
    throw error;
  }
}

async function eventById(eventId) {
  try {
    const event = await Event.findById(eventId).populate("organizerId").lean();

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      success: true,
      message: "Event fetched successfully",
      data: event,
    };
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}

async function updateEvent(eventId, data, user) {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: data },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

async function bookEvent(data, user) {
  const { eventId, seatsBooked, totalAmount, paymentStatus } = data;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (Number(event.availableSeats) < Number(seatsBooked)) {
      throw new Error("Not enough available seats for this event");
    }

    event.availableSeats = Number(event.availableSeats) - Number(seatsBooked);
    await event.save();

    const booking = new BookedEvent({
      userId: user.id,
      eventId,
      seatsBooked,
      totalAmount,
      paymentStatus: paymentStatus || "pending",
      bookedAt: new Date(),
    });

    const savedBooking = await booking.save();

    return {
      success: true,
      message: "Event booked successfully",
      data: savedBooking,
    };
  } catch (error) {
    console.error("Error booking event:", error);
    throw error;
  }
}

async function bookEventList(query, user) {
  try {
    let { userId, organizerId, page, limit } = query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    const skip = (page - 1) * limit;

    let filters = {};

    if (userId) {
      filters.userId = new mongoose.Types.ObjectId(userId);
    } else if (organizerId) {
      const eventIds = await Event.find({ organizerId }, "_id").lean();
      filters.eventId = { $in: eventIds.map((e) => e._id) };
    }
    const bookedEvents = await BookedEvent.find(filters)
      .populate("eventId", "title category venue date price organizerId")
      .populate("userId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalRecords = await BookedEvent.countDocuments(filters);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize: limit,
      },
      data: bookedEvents,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

async function getGlobalAnalytics(user) {
    try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await BookedEvent.countDocuments();

    const totalRevenueAgg = await BookedEvent.aggregate([
      { $match: { paymentStatus: "sucess" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    const latestEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
    const topOrganizers = await Event.aggregate([
      { $group: { _id: "$organizerId", totalEvents: { $sum: 1 } } },
      { $sort: { totalEvents: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "organizer",
        },
      },
    ]);

   return {
      stats: {
        totalUsers,
        totalEvents,
        totalBookings,
        totalRevenue,
      },
      latestEvents,
      topOrganizers,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

module.exports = {
  addEvent,
  listEvent,
  eventById,
  updateEvent,
  bookEvent,
  bookEventList,
  getGlobalAnalytics
};
