import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FaSignOutAlt, FaUserEdit } from 'react-icons/fa'
import useClickOutside from '../../../../hooks/useClickOutside'
import useLogout from '../../../../hooks/useLogout'
import s from './profileMenu.module.css'

export default function ProfileMenu({
  username,
  displayName,
  handleCloseMenu,
  avatarRef,
}) {
  const { logout } = useLogout()
  const router = useRouter()

  const handleClick = () => {
    handleCloseMenu()
    router.push('/profile')
  }
  const handleLogout = () => {
    handleCloseMenu()
    logout()
  }

  // Click Outside handler
  const targetRef = useRef()
  useClickOutside(targetRef, handleCloseMenu, avatarRef)

  return (
    <div ref={targetRef} className={s.menu}>
      <div className={s.nameDiv}>
        <p className={s.displayName}>{displayName || 'Display Name'}</p>
        <p className={s.userName}>@{username || 'username'}</p>
      </div>

      <button onClick={handleClick} className={s.btn}>
        <FaUserEdit /> Edit Profile
      </button>

      <button onClick={handleLogout} className={s.btnLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  )
}
