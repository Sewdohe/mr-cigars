import React, { useEffect, useState } from 'react'
import { useAuthValue } from "./AuthContext";
import { IconButton } from './IconButton';
import { NotificationsTwoTone } from "@mui/icons-material";
import { db } from './Firebase'
import { Text, Popover } from "@nextui-org/react";
import {
  updateDoc,
  doc,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { CustomerDocument } from '../providers/CartProdiver';
import { Notification } from '../@types/notification';

const Notifications = () => {
  const { currentUser } = useAuthValue();
  let userData: CustomerDocument | null = null;
  const [gotNotifications, setGotNotifications] = useState(false)
  let notifications: Notification[] | undefined;

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };


  useEffect(() => {
    if (currentUser) {
      // @ts-ignore
      const _unSub = onSnapshot(doc(db, "users", currentUser.uid), (doc: DocumentSnapshot<CustomerDocument>) => {
        console.log("cart init!");
        userData = doc.data()!;
        notifications = userData?.notifications;
        console.log(notifications)
      });
    }
  }, [ currentUser ])

  return (
    <div>
    <Popover>
      <Popover.Trigger>
        <IconButton onClick={handler}>
          <NotificationsTwoTone />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content>
        {gotNotifications ? notifications?.map(noti => {
            if(noti.status === "Unread") {
              return (
                <p>{noti.message}</p>
            )
            }
          }) : (<span>wow</span>)
        }
      </Popover.Content>
    </Popover>
    </div>
  )
}

export default Notifications
