import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  FaCaretLeft,
  FaPlus,
  FaShare,
  FaTimes,
  FaUserFriends,
} from 'react-icons/fa'
import {
  RiCloseFill,
  RiMenu3Fill,
  RiNotification3Fill,
  RiNotification3Line,
} from 'react-icons/ri'

import { useAuth } from '../../../context/AuthContext'
import useLogout from '../../../hooks/useLogout'
import s from './nav.module.css'
import { useRouter } from 'next/router'
import placeholder from '../../../public/placeholder.png'
import ProfileMenu from './profileMenu'

export default function Nav({ isBack }) {
  const { user } = useAuth()
  const [isProfile, setIsProfile] = useState(false)

  const router = useRouter()
  const {
    query: { id: teamCode },
  } = router
  // Custom Functions
  const handleProfileMenu = () => setIsProfile((prev) => !prev)

  console.count('Nav')
  return (
    <nav className={s.navWrapper}>
      <div className={`${s.nav} wrapper`}>
        {isBack ? (
          <Link href="/" className={s.backBtn}>
            <FaCaretLeft />
            All Teams
          </Link>
        ) : (
          <Link href="/" className={s.logo}>
            FlowFine
          </Link>
        )}
        <div className={s.menus}>
          <div className={s.menus_menu_profile} onClick={handleProfileMenu}>
            {isProfile ? (
              <RiCloseFill className={s.close} />
            ) : (
              <RiMenu3Fill className={s.menu} />
            )}
          </div>
        </div>
      </div>
      {isProfile && <ProfileMenu user={user} setIsProfile={setIsProfile} />}
    </nav>
  )
}
