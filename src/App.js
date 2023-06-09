import { useRef, useState } from "react";
import "./App.css";
import { WebRtcPeer } from "kurento-utils";
import { Participant } from "./participant";
import SockJS from "sockjs-client";

const ws = new WebSocket("wss://localhost:8443/socket");
console.log(ws);
ws.addEventListener("open", () => {
  console.log("open");
});

export function sendMessage(message) {
  var jsonMessage = JSON.stringify(message);
  console.log("Sending message: " + jsonMessage);
  ws.send(jsonMessage);
}

let myStream;
let myPeerConnection;
let participants = {};
const participantsVideo = [];

function App() {
  ws.onmessage = function (message) {
    var parsedMessage = JSON.parse(message.data);
    console.info("Received message: " + message.data);

    switch (parsedMessage.id) {
      case "existingParticipants":
        console.info("!!!!!!!!!why existingParticipants");
        onExistingParticipants(parsedMessage);
        break;
      case "newParticipantArrived":
        console.info("!!!!!!!!!why new");
        onNewParticipant(parsedMessage);
        break;
      case "participantLeft":
        console.info("!!!!!!!!!why left");
        onParticipantLeft(parsedMessage);
        break;
      case "receiveVideoAnswer":
        console.info("!!!!!!!!!why receive~");
        receiveVideoResponse(parsedMessage);
        break;
      // case "onIceCandidate":
      //   console.info("!!!!!!!!!why addIceCandidate 전");
      //   participants[parsedMessage.userId].rtcPeer.addIceCandidate(
      //     parsedMessage.candidate,
      //     function (error) {
      //       console.info("!!!!!!!!!why addIceCandidate 후");
      //       if (error) {
      //         console.error("Error adding candidate: " + error);
      //         alert(error);
      //         return;
      //       }
      //     }
      //   );
      //   break;
      default:
        console.error("Unrecognized message", parsedMessage);
    }
  };
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(false);

  const userNameRef = useRef();
  const roomNameRef = useRef();
  const welcomeRef = useRef();
  const callRef = useRef();
  const vidRef = useRef();
  const vid2Ref = useRef();
  const vid3Ref = useRef();
  const vid4Ref = useRef();
  const vid5Ref = useRef();
  const vid6Ref = useRef();
  const vid7Ref = useRef();
  const vid8Ref = useRef();
  const vid9Ref = useRef();
  const vid10Ref = useRef();
  const videoRefs = [
    vidRef,
    vid2Ref,
    vid3Ref,
    vid4Ref,
    vid5Ref,
    vid6Ref,
    vid7Ref,
    vid8Ref,
    vid9Ref,
    vid10Ref,
  ];
  const enterRoom = (e) => {
    e.preventDefault();
    console.log(userNameRef.current.value);
    var message = {
      id: "joinRoom",
      userId: userNameRef.current.value,
      roomId: roomNameRef.current.value,
      video: true,
      audio: true,
    };
    sendMessage(message);
  };

  function onExistingParticipants(pm) {
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          maxWidth: 320,
          maxFrameRate: 30,
          minFrameRate: 30,
        },
      },
    };

    const userName = userNameRef.current.value;
    const participant = new Participant(userName);
    participants[userName] = participant;

    const options = {
      localVideo: vidRef.current,
      mediaConstraints: constraints,
      onicecandidate: participant.onIceCandidate.bind(participant),
    };
    participant.rtcPeer = new WebRtcPeer.WebRtcPeerSendonly(options, function (
      error
    ) {
      if (error) {
        alert(error);
        return console.error(error);
      }
      this.generateOffer(participant.offerToReceiveVideo.bind(participant));
    });
    // console.log(participant);
    pm.members.forEach(receiveVideo);
  }

  function receiveVideo(sender) {
    let userId = sender.userId;
    let videoStatus = sender.video;
    let audioStatus = sender.audio;
    var participant = new Participant(userId, videoStatus, audioStatus);
    participants[userId] = participant;

    const options = {
      connectionConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      remoteVideo: vid2Ref.current,
      onicecandidate: participant.onIceCandidate.bind(participant),
    };

    participant.rtcPeer = new WebRtcPeer.WebRtcPeerRecvonly(options, function (
      error
    ) {
      if (error) {
        alert(error);
        return console.error(error);
      }
      this.generateOffer(participant.offerToReceiveVideo.bind(participant));
    });
  }
  function receiveVideoResponse(result) {
    participants[result.userId].rtcPeer.processAnswer(
      result.sdpAnswer,
      function (error) {
        if (error) {
          alert(error);
          return console.error(error);
        }
      }
    );
  }

  const onNewParticipant = async (request) => {
    receiveVideo(request.member);
    // const offer = await myPeerConnection.createOffer();
    // myPeerConnection.setLocalDescription(offer);
  };

  function onParticipantLeft(request) {
    console.log("Participant " + request.userId + " left");
    var participant = participants[request.userId];
    participant.dispose();
    delete participants[request.userId];
  }
  const getMedia = async () => {
    // await getCameras();
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      vidRef.current.srcObject = myStream;
      console.log(myStream);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="App">
      <div ref={welcomeRef}>
        <input ref={userNameRef} placeholder="user name" required type="text" />
        <input ref={roomNameRef} placeholder="room name" required type="text" />
        <button onClick={enterRoom}>Enter Room</button>
        <button onClick={getMedia}>Media</button>
      </div>
      <div ref={callRef}>
        <video ref={vidRef} autoPlay playsInline />
        <video ref={vid2Ref} autoPlay playsInline />
        <video ref={vid3Ref} autoPlay playsInline />
        <video ref={vid4Ref} autoPlay playsInline />
        <video ref={vid5Ref} autoPlay playsInline />
        <video ref={vid6Ref} autoPlay playsInline />
        <video ref={vid7Ref} autoPlay playsInline />
        <video ref={vid8Ref} autoPlay playsInline />
        <video ref={vid9Ref} autoPlay playsInline />
        <video ref={vid10Ref} autoPlay playsInline />
        {/* <button onClick={getMedia}>GetMedia</button>
        <button onClick={handleMute}>{!muted ? "Unmute" : "Mute"}</button>
        <button onClick={handleCamera}>
          {!camera ? "Camera off" : "Camera on"}
        </button> */}
      </div>
      {/* <select>
        {camOptions.map((camOption) => (
          <option key={camOption.deviceId} value={camOption.value}>
            {camOption.label}
          </option>
        ))}
      </select> */}
    </div>
  );
}

export default App;
