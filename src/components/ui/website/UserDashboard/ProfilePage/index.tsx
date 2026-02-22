import React from 'react'
import ProfilePage from './ProfilePage'
import getProfile from '@/utils/getProfile'


const Profile = async () => {

    const profile =  await getProfile()
  return (
    <div>
        <ProfilePage profile={profile}/>
    </div>
  )
}

export default Profile