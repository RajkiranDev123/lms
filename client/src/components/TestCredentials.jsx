import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const TestCredentials = () => {
    const [adminEmail, setAdminEmail] = useState(false)
    const [adminPass, setAdminPass] = useState(false)

    const [userEmail, setUserEmail] = useState(false)
    const [userPass, setUserPass] = useState(false)



    return (
        <div>

            {/*  */}
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>Admin Test Email :
                <CopyToClipboard text="rajkir783@gmail.com">
                    {!adminEmail ? <span onClick={() => setAdminEmail(!adminEmail)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copy!</span>
                        : <span onClick={() => setAdminEmail(!adminEmail)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copied!</span>}

                </CopyToClipboard>
            </p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>Admin Test Password :
                <CopyToClipboard text="12345678">
                    {!adminPass ? <span onClick={() => setAdminPass(!adminPass)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copy!</span>
                        : <span onClick={() => setAdminPass(!adminPass)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copied!</span>}
                </CopyToClipboard>
            </p>
            {/*  */}
            <hr />

            {/*  */}
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>User Test Email :
                <CopyToClipboard text="rk7889666@gmail.com">
                    {!userEmail ? <span onClick={() => setUserEmail(!userEmail)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copy!</span>
                        : <span onClick={() => setUserEmail(!userEmail)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copied!</span>}
                </CopyToClipboard>
            </p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "red", display: "flex", alignItems: "center", gap: 2 }}>User Test Password :
                <CopyToClipboard text="12345678">
                    {!userPass ? <span onClick={() => setUserPass(!userPass)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copy!</span>
                        : <span onClick={() => setUserPass(!userPass)} style={{ cursor: "pointer", color: "blue", display: "flex", alignItems: "center", textDecoration: "" }}> Copied!</span>}
                </CopyToClipboard>
            </p>
            <br />
            {/*  */}
        </div>
    )
}

export default TestCredentials