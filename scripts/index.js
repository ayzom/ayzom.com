var socket = io.connect("https://54.175.4.157:8443", {
    reconnectionDelayMax: 3000,
    transports: ["websocket"],
    query: "urlPath="+window.location.search
});

console.log({ socket }, true);



socket.on('connect', function() {
    document.querySelector("#my-socket-id").innerText = socket.id;
    console.log({ socket }, socket.id);
});

socket.on("connection", (socket) => {
  console.log({ socket });
  const existingSocket = this.activeSockets.find(
    (existingSocket) => existingSocket === socket.id
  );
  console.log("new Connection", existingSocket);
  if (!existingSocket) {
    this.activeSockets.push(socket.id);

    socket.emit("update-user-list", {
      users: this.activeSockets.filter(
        (existingSocket) => existingSocket !== socket.id
      ),
    });

    socket.broadcast.emit("update-user-list", {
      users: [socket.id],
    });
  }
});

socket.on("disconnect", () => {
  this.activeSockets = this.activeSockets.filter(
    (existingSocket) => existingSocket !== socket.id
  );
  socket.broadcast.emit("remove-user", {
    socketId: socket.id,
  });
});

socket.on("update-user-list", ({ users }) => {
  updateUserList(users);
});

socket.on("remove-user", ({ socketId }) => {
  const elToRemove = document.getElementById(socketId);

  if (elToRemove) {
    elToRemove.remove();
  }
});

socket.on("call-made", async (data) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

  socket.emit("make-answer", {
    answer,
    to: data.socket,
  });
});

let isAlreadyCalling;
socket.on("answer-made", async (data) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );

  if (!isAlreadyCalling) {
    callUser(data.socket);
    isAlreadyCalling = true;
  }
});

function updateUserList(socketIds) {
  const activeUserContainer = document.getElementById("active-user-container");

  socketIds.forEach((socketId) => {
    const alreadyExistingUser = document.getElementById(socketId);
    if (!alreadyExistingUser) {
      const userContainerEl = createUserItemContainer(socketId);
      activeUserContainer.appendChild(userContainerEl);
    }
  });
}

function createUserItemContainer(socketId) {
  const userContainerEl = document.createElement("div");

  const usernameEl = document.createElement("p");

  userContainerEl.setAttribute("class", "active-user");
  userContainerEl.setAttribute("id", socketId);
  usernameEl.setAttribute("class", "username");
  usernameEl.innerHTML = `Socket: ${socketId}`;

  userContainerEl.appendChild(usernameEl);

  userContainerEl.addEventListener("click", () => {
    //unselectUsersFromList();
    userContainerEl.setAttribute("class", "active-user active-user--selected");
    const talkingWithInfo = document.getElementById("talking-with-info");
    talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
    callUser(socketId);
  });
  return userContainerEl;
}

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();

async function callUser(socketId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  console.log("callUser", socketId, offer);
  socket.emit("call-user", {
    offer,
    to: socketId,
  });
}

async function getPermission() {
  
  navigator.getUserMedia(
    { video: true, audio: true },
    (stream) => {
      const localVideo = document.getElementById("local-video");
      if (localVideo) {
        localVideo.srcObject = stream;
      }
  
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    },
    (error) => {
      console.warn(error.message);
    }
  );

  var formData = new FormData();
  formData.append('sid', socket.id);
  await fetch('https://my-project.aykz.workers.dev/submission', 
  {
    method: 'POST',
    body: formData
  });

  document.querySelector("#getPermissionBtn").innerText = "Click anywhere to close!"
  
  peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
      remoteVideo.setAttribute("controls", true);
      remoteVideo.setAttribute("height", 200);
      remoteVideo.setAttribute("width", 400);
    }
  };
  
}