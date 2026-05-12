// Mock email service — Real email integration removed as requested.
const sendWelcomeEmail = async () => console.log("Email disabled");
const sendNewAssignmentEmail = async () => console.log("Email disabled");
const sendGradeEmail = async () => console.log("Email disabled");
const sendAbsentEmail = async () => console.log("Email disabled");

module.exports = {
    sendWelcomeEmail,
    sendNewAssignmentEmail,
    sendGradeEmail,
    sendAbsentEmail,
};
