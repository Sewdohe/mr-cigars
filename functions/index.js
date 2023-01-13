const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("firebase-functions/logger/compat");
admin.initializeApp();

exports.sendOrderNotification = functions.firestore
  .document("orders/{docId}")
  .onUpdate((change, context) => {
    // write notification document here!
    const data = change.after.data();
    let notificationsData;
    const options = {
      weekday: "long", year: "numeric",
      month: "long", day: "numeric",
    };

    if (data.status == "Pending Review") {
      const userDocRef = admin.firestore()
        .collection("users")
        .doc(data.customerUID);

      userDocRef.get().then((userDoc) => {
        notificationsData = userDoc.data().notifications;
        notificationsData.push({
          status: "Unread",
          message: "Your order from " +
            new Date(data.orderDate._seconds * 1000)
              .toLocaleDateString("en-US", options) +
            " has been reviewed.",
        });
        return userDocRef.update({ notifications: notificationsData });
      });
    }
  });

  exports.sendAdminNotif = functions.firestore.document('orders/{orderID}').onCreate(
    async (snapshot) => {
      admin.firestore()
      .collection('emails')
      .add({
        to: "website@mrcigars.us",
        message: {
          subject: `New Order From ${snapshot.data().customer}`,
          text: "",
          html: `Review the order from ${snapshot.data().customer}  <br> Click <a href="http://192.168.0.81:4200/order/${snapshot.data().customer}">here</a> to review.`
        }
      }).then(() => console.log("Queued email for delivery!"))
    }
  )

  exports.sendAdminNotifUsers = functions.firestore.document('users/{userID}').onCreate(
    async (snapshot) => {
      admin.firestore()
      .collection('emails')
      .add({
        to: "website@mrcigars.us",
        message: {
          subject: `New Customer: ${snapshot.data().userName} for ${snapshot.data().storeName}`,
          html: `<b>New User: </b> ${snapshot.data().userName} <br> <b>Store Name: </b> ${snapshot.data().storeName} <br> <b>City: </b> ${snapshot.data().storeCity}`
        }
      }).then(() => console.log("Queued email for delivery!"))
    }
  )