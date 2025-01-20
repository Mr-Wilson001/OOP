class User {
    static users = [];

    constructor(userId, username, password, email) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Method to login
    verifyLogin(username, password) {
        const user = User.users.find((u) => u.username === username && u.password === password);
        if (user) {
            console.log(`Login successfully! Welcome, ${user.username}`);
        } else {
            console.log("Invalid username or password");
        }
    }
}

// Define Customer class
class Customer extends User {
    static customers = [];

    constructor(userId, username, password, email, name, phoneNumber) {
        super(userId, username, password, email);
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    // Method to register
    registerCustomer() {
        Customer.customers.push(this);
        User.users.push(this);
        console.log("Registered successfully!");
    }

    // Method to login
    loginCustomer(username, password) {
        super.verifyLogin(username, password);
    }

    // Method to search for available rooms
    searchForAvailableRooms(rooms) {
        const availableRooms = rooms.filter((room) => room.status);
        console.log("Available Rooms:");
        availableRooms.forEach((room) =>
            console.log(`Room number: ${room.roomNumber}, Type: ${room.type}, Price: ${room.price}`)
        );
        return availableRooms;
    }

    // Method to book a room
    bookRoom(room, bookings) {
        if (room.status) {
            room.status = false;
            console.log(`Room ${room.roomNumber} booked successfully!`);
            const bookingId = `B${Math.random().toString(36).substr(2, 9)}`;
            bookings.push({
                bookingId: bookingId,
                userId: this.userId,
                roomNumber: room.roomNumber,
                status: "Pending payment",
                price: room.price,
            });
        } else {
            console.log("Room is not available");
        }
    }

    // Method to make payment
    makePayment(bookingId, bookings) {
        const booking = bookings.find((b) => b.bookingId === bookingId && b.userId === this.userId);
        if (booking) {
            console.log(`Processing payment of N${booking.price} for Booking ID: ${booking.bookingId}`);
            booking.status = "Paid";
            console.log("Payment successful!");
        } else {
            console.log("Invalid booking ID or no booking found for this user");
        }
    }

    // Method to view booking details
    viewBookingDetails(bookings) {
        const bookingDetails = bookings.filter((bd) => bd.userId === this.userId);
        if (bookingDetails.length > 0) {
            console.log("Your bookings:");
            bookingDetails.forEach((booking) =>
                console.log(`BookingID: ${booking.bookingId}, Room Number: ${booking.roomNumber}, Room type: ${booking.roomType}`)
            );
        } else {
            console.log("No bookings found");
        }
    }

    // Method to cancel booking
    cancelBooking(bookingId, bookings, rooms) {
        const bookingIndex = bookings.findIndex((bfi) => bfi.bookingId === bookingId && bfi.userId === this.userId);
        if (bookingIndex === -1) {
            console.log("Invalid booking ID or no booking found for this user");
            return;
        }
        const booking = bookings[bookingIndex];
        const room = rooms.find((rf) => rf.roomNumber === booking.roomNumber);

        if (room) {
            room.status = true;
            bookings.splice(bookingIndex, 1);
            console.log(`Booking ID: ${bookingId} has been cancelled successfully`);
        }
    }
}

// Define Admin class
class Admin extends User {
    static admins = [];

    constructor(userId, username, password, email, adminName) {
        super(userId, username, password, email);
        this.adminName = adminName;
    }

    // Method to add or update room
    addOrUpdateRoom(rooms, roomNumber, type, price, status = true) {
        const room = rooms.find((rf) => rf.roomNumber === roomNumber);
        if (room) {
            room.type = type;
            room.price = price;
            room.status = status;
            console.log(`Room ${roomNumber} updated successfully!`);
        } else {
            const newRoom = new Room(roomNumber, type, price, status);
            rooms.push(newRoom);
            console.log(`Room ${roomNumber} added successfully!`);
        }
    }

    // Method to view all bookings
    viewAllBookings(bookings) {
        if (bookings.length > 0) {
            console.log("All bookings:");
            bookings.forEach((booking, index) => {
                console.log(`${index + 1}, Booking ID: ${booking.bookingId}, User ID: ${booking.userId}, Room Number: ${booking.roomNumber}, Status: ${booking.status}, Price: ${booking.price}`);
            });
        } else {
            console.log("No bookings found");
        }
    }
}

// Define Room class
class Room {
    static rooms = [];

    constructor(roomNumber, type, price, status) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.price = price;
        this.status = status;
    }
}

// Example of usage
const bookings = [];

const rooms = [
    new Room(101, "Single", 50000, true),
    new Room(102, "Double", 85000, true),
    new Room(103, "Suite", 120000, false),
];

// Create a customer and register them
const customer = new Customer(1, "Gozmork", "gozmork080", "gozmork@gmail.com", "Ogugor Chigozie", "09069306885");
customer.registerCustomer();

// Search for available rooms
const availableRooms = Customer.customers[0].searchForAvailableRooms(rooms)

// Book a room
if (availableRooms.length > 0) {
    Customer.customers[0].bookRoom(availableRooms[0], bookings);
}

// Create an admin
const admin = new Admin(2, "admin1", "adminpass", "admin@example.com", "Admin User");

// Admin to add or update room
admin.addOrUpdateRoom(rooms, 104, "Deluxe", 150000, true);

// Admin to view all bookings
admin.viewAllBookings(bookings);