import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { BorrowModel } from "../models/borrowModel.js";
import { BookModel } from "../models/bookModel.js";
import { UserModel } from "../models/userModel.js";



import csv from "fast-csv"
import fs from "fs"




export const getMetaUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const dateRange = req.headers["date-range"];
    let startDate, endDate;

    // Parse date range if provided
    if (typeof dateRange === "string" && dateRange.includes("--")) {
        const [start, end] = dateRange.split("--");
        startDate = new Date(start + "T00:00:00Z");
        endDate = new Date(end + "T23:59:59Z");
    }

    try {
        const user = await UserModel.findById(userId).select("borrowedBooks");

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Filter borrowed books by date range if provided
        const filteredBooks = user.borrowedBooks.filter(book => {
            if (!startDate || !endDate) return true;
            const borrowedDate = new Date(book.borrowedDate);
            return borrowedDate >= startDate && borrowedDate <= endDate;
        });

        const now = new Date();

        // Count books based on status
        const returnedCounts = filteredBooks.filter(book => book.returned === true).length;
        const notReturnedCounts = filteredBooks.filter(book => book.returned === false).length;

        const overdueCounts = filteredBooks.filter(book =>
            book.returned === false && new Date(book.dueDate) < now
        ).length;

        res.status(200).json({
            success: true,
            counts: {
                total: filteredBooks.length,
                returned: returnedCounts,
                notReturned: notReturnedCounts,
                overdue: overdueCounts,
            },
            message: "Borrowed book counts with return and overdue status fetched successfully!",
        });

    } catch (error) {
        return next(new ErrorHandler(error?.message || "Internal Server Error!", 500));
    }
});






//monthly job count
// export const pdfDownload = catchAsyncErrors(async (req, res, next) => {
//     const { _id } = req.user;//employer id
//     try {
//         const Data = await Application.find({
//             "employerInfo.id": _id,
//             "deletedBy.employer": false,
//         })


//         const csvStream = csv.format({ headers: true })

//         if (!fs.existsSync("csv")) {
//             fs.mkdirSync("csv")
//             if (fs.existsSync("csv")) {
//                 fs.mkdirSync("csv/files")
//             }
//         }
//         const writableStream = fs.createWriteStream(
//             "csv/files/pdf.csv"
//         )
//         csvStream.pipe(writableStream)
//         writableStream.on("finish", () => {

//             res.status(200).json({ downloadUrl: `${process.env.b_url}/csv/files/pdf.csv` })
//         })
//         if (Data.length > 0) {
//             Data.map(e => {
//                 csvStream.write({
//                     Name: e.jobSeekerInfo?.name ? e.jobSeekerInfo?.name : "-",
//                     Email: e.jobSeekerInfo?.email ? e.jobSeekerInfo?.email : "-",
//                     Phone: e.jobSeekerInfo?.phone ? e.jobSeekerInfo?.phone : "-",
//                     "Applied For": e.jobInfo?.jobTitle ? e.jobInfo?.jobTitle : "-",
//                     Date: e.createdAt ? e.createdAt : "-",
//                     Viewed: e.viewed ? "Viewed" : "Not-Viewed",
//                 })
//             })
//         }
//         csvStream.end()
//         writableStream.end()
//     } catch (error) {

//         return next(new ErrorHandler(error?.message || "Internal Server Error!", 500))

//     }
// });
