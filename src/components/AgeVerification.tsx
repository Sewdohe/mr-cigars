import React, { useEffect } from "react";
import { Modal, Button, Row } from "@nextui-org/react";
import { navigate } from "gatsby";

const AgeVerification = () => {
  const isBrowser = typeof window !== "undefined";
  const isOfAge = isBrowser ? window.localStorage.getItem("ageVerified") : "false";

  // DEBUG FUNCTION
  if(isOfAge == "true") {
    console.log("user has verified thier age already")
  }

  const [visible, setVisible] = React.useState(isOfAge == "true" ? false : true);
  const handler = () => setVisible(true);

  function storeAgeVerification() {
    if (isBrowser) {
      window.localStorage.setItem("ageVerified", "true");
      setVisible(false)
    }
  }

  function readAgeVerification(): string | null {
    if (isBrowser) {
      return window.localStorage.getItem("ageVerified");
    } else {
      return null;
    }
  }

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <h2>Are you 21 or Older?</h2>
      </Modal.Header>
      <Modal.Body>
        <p>You must be at least 21 years old to use this website</p>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Button color="primary" onClick={() => storeAgeVerification()}>I am over 21</Button>
          <Button color="error" onClick={() => navigate('/youngin')}>I am not at least 21</Button>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default AgeVerification;
