import { useState, createContext } from 'react';

/* * */
/* APPSTATE */
/* Context that holds the device data and screens state. */
/* Explanation needed. */
/* * */

export const Appstate = createContext();

export default function AppstateProvider({ children }) {
  //
  // DEVICE DATA
  // This state variable holds all the data and device settings.
  const [deviceData, setDeviceData] = useState();

  // CURRENT FOLDER ID
  // The folder that is selected at the moment.
  const [currentFolder, setCurrentFolder] = useState();

  // CURRENT USER
  // The user that is logged in the app at the moment.
  const [currentUser, setCurrentUser] = useState();
  let userActivityInterval;

  // OVERLAY COMPONENT
  // The component that is in display at the moment.
  const [overlayComponent, setOverlayComponent] = useState();

  // CONTEXT
  const contextValue = {
    device: deviceData,
    setDevice: setDeviceData,
    hasDevice: !(deviceData === null || deviceData === undefined),

    currentFolder: (() => deviceData?.layout.folders.find((folder) => folder._id === currentFolder?._id))(),
    setCurrentFolder: setCurrentFolder,
    hasCurrentFolder: !(currentFolder === null || currentFolder === undefined),

    currentUser: (() => deviceData?.users.find((user) => user._id === currentUser?._id))(),
    loginUser: loginUser,
    logoutUser: logoutUser,
    hasCurrentUser: !(currentUser === null || currentUser === undefined),

    overlay: overlayComponent,
    setOverlay: setOverlayComponent,
    hasOverlay: !(overlayComponent === null || overlayComponent === undefined),
  };

  // SUPPORT FUNCTIONS

  function loginUser(usr) {
    // Set logged in user
    setCurrentUser(usr);
    // Setup the interval to check for user activity
    userActivityInterval = setInterval(() => {
      // Check localStorage for the last time user has interacted with the app
      const lastActivity = localStorage.getItem('user_actvity');
      // Milliseconds between now & last activity
      const elapsedMilliseconds = Math.abs(new Date(lastActivity) - new Date());
      // Get timeout form device settings or default to 30 seconds
      const inactivityTimeout = deviceData?.settings?.inactivity_timeout || 30000;
      // If elapsed time is longer than timeout logout user
      if (elapsedMilliseconds > inactivityTimeout) {
        logoutUser();
      }
      // Check for inactivity every 5 seconds
    }, 5000);
  }

  function logoutUser() {
    // Clear interval, unset overlay and unset user
    clearInterval(userActivityInterval);
    setOverlayComponent();
    setCurrentUser();
  }

  return <Appstate.Provider value={contextValue}>{children}</Appstate.Provider>;
}
