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
