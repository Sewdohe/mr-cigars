import React, { useEffect, useState } from 'react'
import { useAuthValue } from "./AuthContext";
import { IconButton } from './IconButton';
import { NotificationsTwoTone } from "@mui/icons-material";
import { db } from './Firebase'
import { Button, Popover } from "@nextui-org/react";
import {
  doc,
  onSnapshot,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { CustomerDocument } from '../providers/CartProdiver';
import { Notification } from '../@types/notification';
import styled from 'styled-components';
import uuid from 'react-uuid';

const NotiContainer = styled.div`
  padding: 1rem;
  min-height: 100px;
  min-width: 150px;
  border: 1px solid blue;
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
  let userData: CustomerDocument | null = null;
  let userRef = doc(db, `users/${currentUser?.uid}`);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const clearNotification = (index: number) => {
    notifications[index].status = "Read"
    updateDoc(userRef, { notifications: notifications })
  }


  useEffect(() => {
    if (currentUser) {
      // @ts-ignore
      const _unSub = onSnapshot(doc(db, "users", currentUser.uid), (doc: DocumentSnapshot<CustomerDocument>) => {
        userData = doc.data()!;
        let nots = userData?.notifications;
        setNotifications(nots!)
      });
    }
    
    if (notifications.length != 0) {
      // loop thru and count unread notifications
      let unReadCount = 0;
      notifications.forEach(noti => {
        if(noti.status == "Unread") {
          unReadCount++;
        }
      })

      setUnreadNotifications(unReadCount);
    }
  }, [currentUser])

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
                        <h3>{noti.message}</h3>
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
