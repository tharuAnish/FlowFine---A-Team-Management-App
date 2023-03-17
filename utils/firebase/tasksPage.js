import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../../lib/firebase'

// **** TASKS ****
export const joinTask = async (
  username,
  taskDocId,
  taskid,
  teamCode,
  handleLoading
) => {
  let id
  try {
    // Initialization Loading
    handleLoading(true)
    id = toast.loading(<b>Joining Task Please Wait..</b>)

    // Refs
    const docRef = doc(db, 'taskinfo', taskDocId)
    const activityRef = doc(collection(db, 'teams', teamCode, 'activity'))

    const batch = writeBatch(db)

    // update task info
    batch.update(docRef, {
      assignedMembers: arrayUnion(username),
    })

    // Setting Activity
    batch.set(activityRef, {
      message: `Wow @${username} join the task : ID-${taskid}`,
      timestamp: serverTimestamp(),
    })

    // Commiting Changes
    await batch.commit()
    toast.success(<b>Joined Successfully</b>, { id })
  } catch (error) {
    console.log('Joining Task Error', error)
    toast.error(<b>{error.message}</b>, { id })
  } finally {
    handleLoading(false)
  }
}

export const leaveTask = async (
  username,
  taskDocId,
  taskid,
  teamCode,
  handleLoading
) => {
  let id
  try {
    // Initialization Loading
    handleLoading(true)
    id = toast.loading(<b>Leaving Task Please Wait..</b>)

    // Refs
    const docRef = doc(db, 'taskinfo', taskDocId)
    const activityRef = doc(collection(db, 'teams', teamCode, 'activity'))

    const batch = writeBatch(db)

    // Updates Task Info
    batch.update(docRef, {
      assignedMembers: arrayRemove(username),
    })

    // Setting Activity
    batch.set(activityRef, {
      message: `Ohh ho! @${username} leave the task : ID-${taskid}`,
      timestamp: serverTimestamp(),
    })

    // Commiting Changes
    await batch.commit()
    toast.success(<b>Leaved Successfully</b>, { id })
  } catch (error) {
    console.log('Leaving Task Error', error)
    toast.error(<b>{error.message}</b>, { id })
  } finally {
    handleLoading(false)
  }
}

export const markTaskStatus = async (
  username,
  status,
  teamcode,
  taskDocId,
  taskid,
  handleLoading,
  handleModal,
  isJoined,
  access = 0,
  taskShortData
) => {
  let id
  try {
    // Initialization Loading
    handleLoading(true)
    id = toast.loading(<b>Changing Task Status...</b>)
    const isArchive = status === 'archive'

    // If Not Joined
    if (!isJoined) throw new Error('You need to joined first!')

    // If Status Archived and User is not an editor
    if (isArchive && !access)
      throw new Error(
        'You dont have the required permission to archive this task.'
      )

    // Refs
    const teamRef = doc(db, 'teams', teamcode)
    const taskRef = doc(teamRef, 'tasks', taskDocId)
    const activityRef = doc(collection(teamRef, 'activity'))
    const archiveRef = doc(teamRef, 'archives', taskDocId)

    const batch = writeBatch(db)

    // If Status Archive
    if (isArchive) {
      // Setting ARchive
      batch.set(archiveRef, {
        ...taskShortData,
        updatedAt: serverTimestamp(),
        status: 'archived',
        archivedBy: username,
      })
      // Deleting from Tasks List
      batch.delete(taskRef)
    } else {
      // Changing Status
      batch.update(taskRef, {
        status,
        updatedAt: serverTimestamp(),
      })
    }

    // Writing to Comments Info
    batch.set(activityRef, {
      message: isArchive
        ? `@${username} archived the task ID-${taskid}`
        : `@${username} just set the task ID-${taskid} status to : ${status?.toUpperCase()}`,
      timestamp: serverTimestamp(),
    })
    // Updating Team Last Updates
    batch.update(teamRef, {
      updatedAt: serverTimestamp(),
    })
    // Commiting Changes
    await batch.commit()
    handleModal()
    toast.success(<b>Changed to {status} Successfully</b>, { id })
  } catch (error) {
    console.log('Changing Task Status Error :', error)
    toast.error(<b>{error.message}</b>, { id })
  } finally {
    handleLoading(false)
  }
}

// Adding Comment
export const addComment = async (
  username,
  comment,
  taskDocId,
  teamCode,
  handleLoading,
  handleClearComment
) => {
  try {
    // Initialization Loading
    handleLoading(true)

    // Refs
    const commentref = doc(collection(db, 'taskinfo', taskDocId, 'comments'))
    const teamRef = doc(db, 'teams', teamCode)
    const taskRef = doc(teamRef, 'tasks', taskDocId)

    const batch = writeBatch(db)

    // Adding Comment
    batch.set(commentref, {
      username,
      comment,
      timestamp: serverTimestamp(),
      teamcode: teamCode,
    })
    handleClearComment()
    // Updating Task time
    batch.update(taskRef, {
      updatedAt: serverTimestamp(),
    })
    // Updating Team Time
    batch.update(teamRef, {
      updatedAt: serverTimestamp(),
    })
    // Commiting Changes
    await batch.commit()
  } catch (error) {
    console.log('Adding Comment error :', error)
    toast.error(<b>{error.message}</b>)
  } finally {
    handleLoading(false)
  }
}
