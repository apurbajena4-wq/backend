const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://automatestudentattendance_db_user:Attendance123@cluster0.mfvi37u.mongodb.net/student_attendance_db').then(async () => {
    
    // Find the student with rollNo '66' (String)
    const student = await mongoose.connection.collection('students').findOne({ rollNo: '66' });
    
    if (student) {
        console.log('Found student with rollNo "66", deleting...');
        
        await mongoose.connection.collection('students').deleteOne({ rollNo: '66' });
        
        if (student.userId) {
            console.log('Deleting associated User account as well: ', student.userId);
            await mongoose.connection.collection('users').deleteOne({ _id: student.userId });
        }
        
        await mongoose.connection.collection('attendances').deleteMany({ studentId: student.userId });
        
        console.log('Successfully deleted student 66 and associated data.');
    } else {
        console.log('Student 66 not found in the students collection.');
    }
    
    process.exit();
});
