import { useEffect, useState } from "react"
import { State, User,UserDetail } from "./type/profile"
import { queryState } from "./lib/contracts"
import { useNavigate } from "react-router-dom"
import { getUserDetails } from "./lib/contracts"

export function ProfileList() {
  const [state, setState] = useState<State | null>(null)
  const navigate = useNavigate()
  // const [userDetails, setUserDetails] = useState<UserDetail | null>(null)
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({}) // Change to store multiple user details


  useEffect(() => {
    const fetchState = async () => {
      const fetchedState = await queryState()
      setState(fetchedState)
      console.log("fetchedState",fetchedState)
    }
    fetchState()
  }, [])
  //get user details


  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     for (const user of state?.users || []) {
  //       const details = await getUserDetails(user.id)
  //       setUserDetails(details)
  //       console.log("fetchUserDetails",details)
  //     }
  //   }
  //   fetchUserDetails()
  // }, [state])


  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!state?.users) return
      
      const newDetails: Record<string, UserDetail> = {}
      
      for (const user of state.users) {
        // Skip if we already have the details
        if (userDetails[user.id]) continue
        
        const details = await getUserDetails(user.id)
        if (details) {
          newDetails[user.id] = details
        }
      }
      
      // Update state only if we have new details
      if (Object.keys(newDetails).length > 0) {
        setUserDetails(prev => ({...prev, ...newDetails}))
      }
    }
    fetchUserDetails()
  }, [state])

  return (
    <div className="min-h-screen bg-blue-50 p-4">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100 flex justify-between items-center bg-blue-600">
          <h2 className="text-2xl font-semibold text-white font-handwriting">Profiles</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 text-sm font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50 transition-colors duration-200 font-handwriting"
          >
            Create Profile
          </button>
        </div>
        
        <div className="divide-y divide-blue-100">
          {/* {state?.users.map((user: User, index: number) => (
            <div key={index} className="p-6 hover:bg-blue-50 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    ID: {user.id}
                  </h3>
                  {userDetails && (
                    <>
                      <p className="text-sm text-blue-700 mt-1">
                        Name: {userDetails.name}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Description: {userDetails.description} 
                      </p>
                    </>
                  )}
                  <p className="text-sm text-blue-400 mt-2">
                    Owner: {user.owner}
                  </p>
                </div>
              </div>
            </div>
          ))} */}
          {state?.users.map((user: User, index: number) => (
      <div key={index} className="p-6 hover:bg-blue-50 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-blue-900 font-handwriting">
              ID: {user.id}
            </h3>
            {userDetails[user.id] && (
              <>
                <p className="text-sm text-blue-400 mt-2 font-handwriting">
                  Name: {userDetails[user.id].name}
                </p>
                <p className="text-sm text-blue-400 mt-2 font-handwriting">
                  Description: {userDetails[user.id].description} 
                </p>
              </>
            )}
            <p className="text-sm text-blue-400 mt-2 font-handwriting">
              Owner: {user.owner}
            </p>
          </div>
        </div>
      </div>
    ))}
        </div>
      </div>
    </div>
  </div>
  )
}
