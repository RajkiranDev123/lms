
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { useState } from "react";



const DateRange = ({ handleFetchMeta }) => {


    const [dateRangeFrom, setDateRangeFrom] = useState(dayjs())
    const [dateRangeTo, setDateRangeTo] = useState(dayjs())

    function search() {

        handleFetchMeta(dateRangeFrom.format("YYYY-MM-DD") + "--" + dateRangeTo.format("YYYY-MM-DD"))
    }
    function clear() {

        handleFetchMeta()
        setDateRangeFrom(dayjs())
        setDateRangeTo(dayjs())

    }

    return (<>


        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "space-between",background:"" }}>
            <div>
                {/* start */}

                <p style={{ fontFamily: "arial", fontSize: 14, color: "blue" }}>Start Date : {dateRangeFrom.format("DD-MM-YYYY")}</p>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={dateRangeFrom} onChange={(newValue) => setDateRangeFrom(newValue)} />
                </LocalizationProvider>
                {/* start ends */}
            </div>

            {/* end */}
            <div>
                <p style={{ fontFamily: "arial", fontSize: 14, color: "red" }}>End Date: {dateRangeTo.format("DD-MM-YYYY")}</p>

                <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <DatePicker value={dateRangeTo} onChange={(newValue) => setDateRangeTo(newValue)} />
                </LocalizationProvider>
                {/* end ends */}
            </div>
        </div>
        {/* buttons */}
        <div style={{ display: "flex", gap: 3, padding: 3, justifyContent: "center" }}>
            <button style={{
                fontSize: 13,
                border: "none", borderRadius: 4, cursor: "pointer", background: "black", color: "white", padding: 2,
            }}
                onClick={() => search()}
            >
                Search
            </button>
            <button style={{
                fontSize: 13,
                border: "none", borderRadius: 4, cursor: "pointer", background: "green", color: "white", padding: 1,
            }}
                onClick={() => clear()}
            >Clear</button>
        </div>
    </>

    )
}

export default DateRange