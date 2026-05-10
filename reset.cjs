const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb+srv://automatestudentattendance_db_user:Attendance123@cluster0.mfvi37u.mongodb.net/student_attendance_db').then(async () => {
    const hp = await bcrypt.hash('psoumya@666', 10);
    await mongoose.connection.collection('users').updateOne(
        { email: 'psoumya666@gmail.com' },
        { $set: { password: hp } }
    );
    console.log('Password reset to psoumya@666 successfully!');
    process.exit();
});
