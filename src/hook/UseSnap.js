import { useEffect, useRef, useState } from "react";
import { MIDTRANS_APP, MIDTRANS_CLIENT } from "../App";

const useSnap = () => {
  const [snap, setSnap] = useState(null);
  const snapInstance = useRef(null); // Track Snap instance
  useEffect(() => {
    // You can also change below url value to any script url you wish to load,
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    if (window.snap) {
      setSnap(window.snap);
      return;
    }
    const myMidtransClientKey = MIDTRANS_CLIENT;
    let scriptTag = document.createElement("script");
    scriptTag.src = `${MIDTRANS_APP}/snap/snap.js`;

    // Optional: set script attribute, for example snap.js have data-client-key attribute
    // (change the value according to your client-key)

    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    console.log("load");
    scriptTag.onload = () => {
      setSnap(window.snap);
    };
    console.log(scriptTag);
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  // Then somewhere else on your React component, `window.snap` global object will be available to use
  // e.g. you can then call `window.snap.pay( ... )` function.
  const resetSnapModal = () => {
    if (document.querySelector(".snap-midtrans-popup")) {
      document.querySelector(".snap-midtrans-popup").remove();
      console.warn("Existing Snap modal removed.");
    }
  };
  const snapEmbed = (snap_token, embedId, action) => {
    if (!snap) {
      console.error("Snap.js is not ready yet.");
      return;
    }
    if (snapInstance.current) {
      console.warn("Snap already embedded. Destroying previous instance...");
      snapInstance.current.close(); // Force close previous instance
      snapInstance.current = null;
    }
    try {
      if (snap) {
        resetSnapModal();
        snapInstance.current = snap.embed(snap_token, {
          embedId,
          onSuccess: function (result) {
            /* You may add your own implementation here */
            alert("payment success!");
            console.log(result);
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            alert("wating your payment!");
            console.log(result);
          },
          onError: function (result) {
            /* You may add your own implementation here */
            alert("payment failed!");
            console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            alert("you closed the popup without finishing the payment");
            action.onClose();
          },
        });
      }
    } catch (error) {
      console.error("Error embedding Snap:", error);
    }
  };
  return { snapEmbed };
};

export default useSnap;
