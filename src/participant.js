import React, { useRef, useState } from "react";
import { sendMessage } from "./App";

export class Participant {
  constructor(userId, videoStatus, audioStatus) {
    this.userId = userId;
    this.videoStatus = videoStatus;
    this.audioStatus = audioStatus;
    this.rtcPeer = undefined;
    Object.defineProperty(this, "rtcPeer", { writable: true });
  }

  offerToReceiveVideo = function (error, offerSdp) {
    if (error) return console.error("sdp offer error");
    console.log("Invoking SDP offer callback function");
    var msg = {
      id: "receiveVideoFrom",
      userId: this.userId,
      sdpOffer: offerSdp,
    };
    sendMessage(msg);
  };
  onIceCandidate = function (candidate) {
    //		console.log("Local candidate" + JSON.stringify(candidate));
    var message = {
      id: "onIceCandidate",
      userId: this.userId,
      candidate: candidate,
    };
    sendMessage(message);
  };

  dispose() {
    console.log("Disposing participant " + this.userId);
    this.rtcPeer.dispose();
  }
}

// export function Participant(userId, videoStatus, audioStatus) {
//   this.userId = userId;
//   this.videoStatus = videoStatus;
//   this.audioStatus = audioStatus;
//   this.rtcPeer = undefined;

//   this.offerToReceiveVideo = function (error, offerSdp) {
//     if (error) return console.error("sdp offer error");
//     console.log("Invoking SDP offer callback function");
//     var msg = {
//       id: "receiveVideoFrom",
//       userId: this.userId,
//       sdpOffer: offerSdp,
//     };
//     sendMessage(msg);
//   };

//   this.onIceCandidate = function (candidate) {
//     //		console.log("Local candidate" + JSON.stringify(candidate));
//     var message = {
//       id: "onIceCandidate",
//       userId: this.userId,
//       candidate: candidate,
//     };
//     sendMessage(message);
//   };
//   Object.defineProperty(this, "rtcPeer", { writable: true });
//   this.dispose = function () {
//     console.log("Disposing participant " + this.userId);
//     this.rtcPeer.dispose();
//   };
// }

const PARTICIPANT_MAIN_CLASS = "participant main";
const PARTICIPANT_CLASS = "participant";

const ParticipantComp = ({ userId, videoStatus, audioStatus }) => {
  const [participantObj, setParticipantObj] = useState(() => {
    const participant = new Participant(userId, videoStatus, audioStatus);
    return participant;
  });
  const containerRef = useRef();
  const switchContainerClass = () => {
    if (containerRef.current.className === PARTICIPANT_CLASS) {
    }
  };
  // ParticipantObject 클래스 정의

  return (
    <div ref={containerRef}>
      <video autoPlay playsInline controls={false} />
      <span>참여자명: {participantObj.userId}</span>
      {/* JSX에서 참여자 객체의 속성 사용 */}
      <button onClick={() => participantObj.dispose()}>Dispose</button>
    </div>
  );
};

export default ParticipantComp;
