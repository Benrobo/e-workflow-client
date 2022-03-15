import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Notification } from '../../helpers/util';
import "./style.css"


let notif = new Notification()


function Meeting() {
    const { id } = useParams()

    // verify id
    let Fid = id.split("-");

    if (Fid.length !== 3) {
        notif.error("meeting id is invalid")
        return window.location = "/user/collab"
    }

    if (window.JitsiMeetExternalAPI) {
        startMeeting()
    } else {
        alert('JitsiMeetExternalAPI not loaded');
    }

    function startMeeting() {
        const domain = 'meet.jit.si';
        const options = {
            roomName: id,
            width: "100vw",
            height: "100vh",
            configOverwrite: {
                disableInviteFunctions: true,
                dynamicBrandingUrl: "https://github.com/Benrobo/e-workflow-client",
                hideConferenceSubject: true,
                disableThirdPartyRequests: true,
                defaultRemoteDisplayName: 'E-Flow',
                disabledSounds: ['REACTION_SOUND'],
                autoKnockLobby: true,
                toolbarButtons: [
                    'camera',
                    'chat',
                    'closedcaptions',
                    'desktop',
                    'download',
                    'etherpad',
                    'fullscreen',
                    'hangup',
                    'livestreaming',
                    'microphone',
                    'mute-everyone',
                    'mute-video-everyone',
                    'participants-pane',
                    'profile',
                    'raisehand',
                    'recording',
                    'security',
                    'select-background',
                    'settings',
                    'shareaudio',
                    'sharedvideo',
                    'shortcuts',
                    'toggle-camera',
                    '__end',
                ],
            },
            interfaceConfigOverwrite: {
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                APP_NAME: 'E-flow',
                MOBILE_APP_PROMO: false,
                SHOW_JITSI_WATERMARK: false,
                HIDE_DEEP_LINKING_LOGO: true,
                NATIVE_APP_NAME: 'E-flow',
                DEFAULT_BACKGROUND: '#06141D',
                JITSI_WATERMARK_LINK: "https://github.com/Benrobo/e-workflow-client",
                SHOW_CHROME_EXTENSION_BANNER: false,
                VIDEO_QUALITY_LABEL_DISABLED: true,
                SETTINGS_SECTIONS: ['devices', 'moderator', 'profile', 'sounds'],
            },
            parentNode: document.querySelector('#meet')
        };

        let api = new window.JitsiMeetExternalAPI(domain, options);



        api.addEventListeners({
            participantLeft: handleClose,
            // participantJoined: handleParticipantJoined,
            // videoConferenceJoined: handleVideoConferenceJoined,
            // videoConferenceLeft: handleVideoConferenceLeft,
            // audioMuteStatusChanged: handleMuteStatus,
            // videoMuteStatusChanged: handleVideoStatus
        });

        function handleClose() {
            window.location = "/user/collab"
        }

    }

    return (
        <div id="meet"></div>
    )
}

export default Meeting