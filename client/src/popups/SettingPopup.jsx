import React, { useState, useEffect } from 'react'
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux"
import { updatePassword } from "../store/slices/authSlice"
import settingIcon from "../assets/setting.png"
import { toggleSettingPopup } from "../store/slices/popUpSlice"
const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.user)
  const handleUpdatePassword = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("currentPassword", currentPassword)
    data.append("newPassword", newPassword)
    data.append("confirmPassword", confirmNewPassword)
    dispatch(updatePassword(data))
  }

  //inset-0 is a utility class that sets the top, right, bottom, and left properties of an element to 0
  //used with : absolute : (works in the contect of relative...) or fixed 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
        <div className="p-6">
          <header
            className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black"
          >
            <div className="flex items-center gap-3">
              <img src={settingIcon} alt="keyIcon" className="bg-gray-300 p-5 rounded-lg" />
              <h3 className="text-xl font-bold">Change Credentials</h3>

            </div>
            <img src={closeIcon} alt="close-icon" onClick={() => dispatch(toggleSettingPopup())} />
          </header>


          <form onSubmit={handleUpdatePassword}>

            {/* fields */}

            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">Current Password :</label>
              <input
                type="text"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md "
              />
            </div>

            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">Enter new Password :</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md "
              />
            </div>


            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">Enter Confirm Password :</label>
              <input
                type="text"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md "
              />
            </div>



            {/* fields ended */}


            {/* buttons */}
            {/* <div className="flex justify-end space-x-4 ">

              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                type="button" onClick={() => dispatch(toggleAddNewAdminPopup())}>Close
              </button>

              <button disabled={loading} className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
                type="button">Add
              </button>

            </div> */}

            <div className='flex gap-4 mt-10'>
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                type="button" onClick={() => dispatch(toggleSettingPopup())}>Cancel
              </button>

              <button disabled={loading} className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
                type="submit">Confirm
              </button>
            </div>



          </form>

        </div>

      </div>


    </div>
  )
}

export default SettingPopup
