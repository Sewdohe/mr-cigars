import React, { useEffect, useState } from 'react'
import { useAuthValue } from "./AuthContext";
import { IconButton } from './IconButton';
import { NotificationsTwoTone } from "@mui/icons-material";
import { db } from './Firebase'
import { Button, Popover, Text } from "@nextui-org/react";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  DocumentData
} from "firebase/firestore";
import { Notification } from '../@types/notification';
import styled from 'styled-components';
import uuid from 'react-uuid';

const NotiContainer = styled.div`
  padding: 1rem;
  min-height: 100px;
  min-width: 150px;
  margin: 0.5rem;
  border-radius: 10px;
`

const NotiActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justifyContent: center;
`

const Notifications = () => {
  const { currentUser } = useAuthValue();
  let userData: DocumentData;
  let userDocument: any;
  let userRef = doc(db, `users/${currentUser?.uid}`);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const clearNotification = (index: number) => {
    notifications[index].status = "Read"
    updateDoc(userRef, { notifications: notifications })
  }


  useEffect(() => {
    const getUserDoc = async () => {
      userDocument = await getDoc(userRef);
      //@ts-ignore
      userData = userDocument.data();
      return userDocument.data()
    }

    getUserDoc().then(res => {
      if (res) {
        const unsub = onSnapshot(doc(db, "users", res.uid), (doc) => {
          let data = doc.data();
          if (data?.notifications.length > 0) {
            // loop thru and count unread notifications
            let unReadCount = 0;
            data?.notifications.forEach((noti: Notification) => {
              if (noti.status != "Read") {
                unReadCount += 1;
              }
            })
            setUnreadNotifications(unReadCount);
            setNotifications(data?.notifications)
          }
        });
      }
    })

  }, [])

  return (
    <div>
      <Popover>
        <Popover.Trigger>
          <IconButton>
            <NotificationsTwoTone />
            <span>({unreadNotifications})</span>
          </IconButton>
        </Popover.Trigger>
        <Popover.Content css={{ padding: '1rem', minWidth: '150px', minHeight: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {notifications.length != 0 ?
            (
              <div>
                {notifications?.map((noti, index) => {
                  if (noti.status !== "Read") {
                    return (
                      <NotiContainer key={uuid()}>
                        <Text>{noti.message}</Text>
                        <NotiActionsContainer>
                          <Button onClick={() => clearNotification(index)} size="sm" color="error">Dismiss</Button>
                        </NotiActionsContainer>
                      </NotiContainer>
                    )
                  }
                })}
              </div>) : (
              <span>No Notifications</span>
            )
          }
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default Notifications
