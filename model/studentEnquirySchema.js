import mongoose from "mongoose";
import moment from "moment";

const studentEnquirySchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    enquiryDate: {
        type: String,
        default: () => moment().format("DD/MM/YYYY")  // ✅ Your required format
    },
    enquiryTime: {
        type: String,
        default: () => moment().format("hh:mm:ss A")  // Optional: you can use "hh:mm A" for AM/PM
    },
    remark: {
        type: String,
        default: "No Remark Yet"
    },
    syllabusStatus: {
        type: String,
        default: "No Mail Sent"
    }
});

export default mongoose.model('studentEnquirySchema', studentEnquirySchema, 'studentEnquiry');
