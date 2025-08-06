
import { useEffect, useState } from "react";
import Header from "../layout/Header"
import { fetchMetaDataAdmin } from "../store/slices/metaSlice"
import { useSelector, useDispatch } from "react-redux";
import { IoMdReturnLeft } from "react-icons/io";
import { GiTireIronCross } from "react-icons/gi";
import { FcStatistics } from "react-icons/fc";
import QRCode from "react-qr-code"

import { TbFilterDown } from "react-icons/tb";
import DateRange from "../components/DateRange"
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import "./loader2.css"



const AdminDashboard = () => {
  const dispatch = useDispatch()

  const { metaData, loading } = useSelector((state) => state.meta);

  const [data, setData] = useState([])


  useEffect(() => {
    console.log(metaData)
    dispatch(fetchMetaDataAdmin())
  }, [])

  useEffect(() => {
    let successRate = ((metaData?.returned / metaData?.total) * 100).toFixed(2);
    let failureRate = ((metaData?.notReturned / metaData?.total) * 100).toFixed(2);


    const dataReturned = [
      { value: successRate, label: "Success" },
      { value: failureRate, label: "Failure" },

    ];
    setData(dataReturned)
    // overdue


  }, [metaData])

  const handleFetchMeta = (arg) => {
    dispatch(fetchMetaDataAdmin(arg))
  };
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      <p style={{
        background: "black",
        color: "white", display: "flex", alignItems: "center", marginTop: 12
        , borderRadius: 3, paddingLeft: 3, borderBottom: "2px ridge grey",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
      }}>  <FcStatistics style={{ height: 22 }} /> &nbsp;Borrowed Info By All Users under Me</p>



      {/* meta starts */}
      {Object?.keys(metaData)?.length > 0 ? <div style={{
        display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, background: "white",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", margin: 5, padding: 4
      }}>



        {/* pie1 */}
        <div
          style={{
            // boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            padding: 5,
            borderRadius: 3,
            width: 160,
            height: 160,
            fontFamily: "monospace", fontSize: 14,
            background: "white", color: "black",
          }}
        >

          {data?.length > 0 && <PieChart
            hideLegend
            colors={["blue", "black"]}

            series={[
              {
                arcLabel: (item) => `${item.value} `,
                arcLabelMinAngle: 45,
                data,
                valueFormatter: (item) => `${item.value}`,

              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "",
                fontSize: 10
              },
            }}

            width={100}
            height={100}
          />}
          <p style={{ color: "blue", fontSize: 12, textAlign: "center" }}>Returned  %</p>
          <p style={{ color: "black", fontSize: 12, textAlign: "center" }}>Not Returned  %</p>

        </div>
        {/* pie1 ends*/}


        {/* returned counts */}
        <div
          style={{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            padding: 5,
            borderRadius: 3,
            width: 245,
            height: 60,
            fontFamily: "monospace", fontSize: 14,
            background: "white", color: "black",
          }}
        >
          <p style={{ fontFamily: "monospace", fontSize: 14, textAlign: "center", display: "flex", alignItems: "center", gap: 1, color: "grey" }}>
            <span style={{ color: "grey" }}>--</span>Total Borrowed by Users&nbsp;  </p>
          <p style={{ fontSize: 14, textAlign: "center" }}>
            {metaData?.total} </p>
        </div>
        {/* returned counts */}

        {/* returned counts */}
        <div
          style={{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            padding: 5,
            borderRadius: 3,
            width: 145,
            height: 60,
            fontFamily: "monospace", fontSize: 14,
            background: "white", color: "black",
          }}
        >
          <p style={{ fontFamily: "monospace", fontSize: 14, textAlign: "center", display: "flex", alignItems: "center", gap: 1, color: "grey" }}>
            <IoMdReturnLeft />Returned &nbsp;  </p>
          <p style={{ fontSize: 14, textAlign: "center" }}>
            {metaData?.returned} </p>
        </div>
        {/* returned counts */}

        {/* not returned counts*/}
        <div
          style={{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            padding: 5,
            borderRadius: 3,
            width: 145,
            height: 60,
            fontFamily: "monospace", fontSize: 14,
            background: "white", color: "black",
          }}
        >
          <p style={{ fontFamily: "monospace", fontSize: 14, textAlign: "center", display: "flex", alignItems: "center", gap: 1, color: "grey" }}>
            <GiTireIronCross />&nbsp;Not Returned&nbsp;  </p>
          <p style={{ fontSize: 14, textAlign: "center" }}>
            {metaData?.notReturned} </p>
        </div>
        {/* not returned counts ends*/}




      </div> : <div style={{ display: "flex", justifyContent: "center", }}><div className="loader2"></div></div>}
      {/* meta ends */}

      {/* qr and pdf */}
      <p style={{ color: "grey", fontSize: 14 }}>Share the info!</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap", gap: 2, margin: 8 }}>
        {/* qr */}
        <QRCode style={{ height: 80, width: 100 }}
          value={
            `Returned : ${metaData?.returned}, Not Returned : ${metaData?.notReturned}`
          } />

        {/* qr  ends*/}
      </div>

      {/* qr and pdf ends*/}

      {/* date range */}
      <div style={{
        border: "0px solid grey", borderRadius: 4, padding: 3,
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
      }}>
        <p style={{
          fontFamily: "monospace", textDecoration: "", display: "flex",
          alignItems: "center", gap: 1, marginBottom: 3, color: "grey", fontSize: 14
        }}><TbFilterDown />Date-Range Filter </p>
        <div style={{ marginTop: 2 }}>
          <DateRange handleFetchMeta={handleFetchMeta} />
        </div>
      </div>
      {/* date range ends*/}

      {/* loader */}
      {loading && <div style={{ display: "flex", justifyContent: "center", margin: 5 }}><div style={{ color: "red" }} className="loader2"></div></div>}


      {/*  */}

    </main>

  </>;
};

export default AdminDashboard;
