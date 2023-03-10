import { useMemo, useState } from 'react'
import { useTeam } from '../../../../context/TeamContext'
import { useUser } from '../../../../context/UserContext'
import { checkAccess } from '../../../../utils/firebase'
import Modal from '../../../modal'
import CreateEvent from '../createEvent'
import s from '../eventsPage.module.css'
import EventCard from './eventCard'

export default function EventsList({ events, hasMore, loadMore, btnLoading }) {
  // Selected Event
  const [selected, setSelected] = useState(null)

  // Custom Function
  const handleCloseModal = () => setSelected(null)

  // Setting Update Event
  const handleSelect = (value) => setSelected(value)

  // Getting Team Data
  const { team_data } = useTeam()
  const { owner, editor, teamcode } = team_data
  // Getting username
  const { username } = useUser()

  const isEditor = checkAccess(editor, owner, username)

  // Partioning Events
  const upcomming = useMemo(
    () => events.filter((event) => new Date(event?.time) > new Date()),
    [events]
  )
  const past = useMemo(
    () => events.filter((event) => new Date(event?.time) < new Date()),
    [events]
  )
  console.log(owner, editor, isEditor, team_data)
  return (
    <>
      <div className={s.eventsList_wrapper}>
        {upcomming?.length ? (
          upcomming.map((event) => (
            <EventCard
              isEditor={isEditor}
              key={event?.id}
              event={event}
              handleSelect={handleSelect}
              teamcode={teamcode}
              username={username}
            />
          ))
        ) : (
          <p className={s.noData}>
            No Upcomming Events Found, Click Add New to add event
          </p>
        )}
      </div>
      <div className={s.eventHeaderBar}>
        <h3 className="header2">Past Events</h3>
      </div>
      <div className={s.eventsList_wrapper}>
        {past?.length ? (
          past.map((event, i) => (
            <EventCard
              isEditor={isEditor}
              key={i}
              event={event}
              handleSelect={handleSelect}
              teamcode={teamcode}
              username={username}
            />
          ))
        ) : (
          <p className={s.noData}>No Events Data Found</p>
        )}
      </div>
      {hasMore ? (
        <button
          disabled={btnLoading}
          onClick={loadMore}
          className={s.loadMoreBtn}
        >
          {btnLoading ? 'Loading' : 'Load More'}
        </button>
      ) : null}

      {selected && isEditor ? (
        <Modal title="Update Event" handleClose={handleCloseModal}>
          <CreateEvent handleClose={handleCloseModal} selected={selected} />
        </Modal>
      ) : null}
    </>
  )
}
