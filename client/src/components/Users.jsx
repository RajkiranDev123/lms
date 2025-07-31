import { useState } from "react";
import { useSelector } from "react-redux"
import Header from "../layout/Header"
import "./loader.css"

//pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { fetchAllUsers } from "../store/slices/userSlice.js"
const Users = () => {
  const { users, pageCount, loading } = useSelector(state => state.user)
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp)
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-
   ${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())} `

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:
   ${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} `

    const result = `${formattedDate} ${formattedTime}`
    return result
  }
  //pagination place 1
  const [page, setPage] = useState(1)

  //pagination place 2
  const changePage = (event, value) => {
    dispatch(fetchAllUsers(value))

    setPage(value)

  }
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      {/* sub header */}
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold ">
          Registered Users
        </h2>
      </header>
      {loading && <div style={{ display: "flex", justifyContent: "center", margin: 2 }}><div className="loader"></div></div>}


      {/* table */}
      {
        users && users?.filter(u => u?.role == "User")?.length > 0 ? (

          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">

            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">No. of Books Borrowed</th>
                  <th className="px-4 py-2 text-center">Registered On</th>
                </tr>
              </thead>

              <tbody>
                {
                  users?.
                    filter(u => u?.role == "User")
                    .map((user, index) => (
                      <tr
                        key={user?._id}
                        className={(index + 1) % 2 == 0 ? "bg-gray-50" : ""}
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{user?.name}</td>
                        <td className="px-4 py-2">{user?.email}</td>
                        <td className="px-4 py-2">{user?.role}</td>
                        <td className="px-4 py-2 text-center">{user?.borrowedBooks.length}</td>
                        <td className="px-4 py-2 text-center">{formatDate(user?.createdAt)}</td>
                      </tr>
                    ))
                }
              </tbody>

            </table>
            {/* pagination */}
            <div className="flex justify-center p-3">
              <Stack spacing={2}>
                <Pagination color="primary" onChange={changePage} page={page} count={pageCount} />
              </Stack>
            </div>
            {/* pagination ends */}

          </div>
        ) : (<h3 className="text-3xl mt-5 font-medium">No registered users found!</h3>)
      }
    </main>
  </>;
};

export default Users;
