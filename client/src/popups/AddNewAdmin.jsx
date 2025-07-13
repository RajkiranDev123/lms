import React, { useState, useEffect } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux"
import { addNewAdmin } from "../store/slices/userSlice"
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice"
import { toast } from "react-toastify";

const AddNewAdmin = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.user)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setAvatar(file)
    }

  }
  const handleAddNewAdmin = (e) => {
    e.preventDefault()

    if (!name || !email || !password || !avatar) {
      toast.error("All fields are required!")
      return
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("avatar", avatar)
    dispatch(addNewAdmin(formData))


  }


  return <>
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg md:w-1/3">
        <div className="p-6">
          <header
            className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black"
          >
            <div className="flex items-center gap-3">
              <img src={keyIcon} alt="keyIcon" className="bg-gray-300 p-5 rounded-lg" />
              <h3 className="text-xl font-bold">Add new Admin</h3>

            </div>
            <img src={closeIcon} alt="close-icon" onClick={() => dispatch(toggleAddNewAdminPopup())} />
          </header>


          <form onSubmit={handleAddNewAdmin}>

            {/* avatar */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="avatarInput" className="cursor-pointer">
                <img src={avatarPreview ? avatarPreview : placeHolder} alt="avatarPreview" className="w-24 h-24 rounded-full object-cover" />
                <input type="file" id="avatarInput" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* fields */}

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Name :</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin's Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              />

            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Email :</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin's Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />

            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Password :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin's Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />

            </div>

            {/* fields ended */}


            {/* buttons */}
            <div className="flex justify-end space-x-4 ">

              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                type="button" onClick={() => dispatch(toggleAddNewAdminPopup())}>Close
              </button>

              <button disabled={loading} className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
                type="submit">Add
              </button>

            </div>



          </form>

        </div>

      </div>


    </div>
  </>;
};

export default AddNewAdmin;
