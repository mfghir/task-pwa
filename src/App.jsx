import { useEffect, useRef, useState } from "react";

function App() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const [timer, setTimer] = useState(30);
  const [videoClosed, setVideoClosed] = useState(false);
  const timerRef = useRef(null);

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const getVideo =async () => {
    await   navigator.mediaDevices
      .getUserMedia({
        video: { width: 430, height: 600 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .then((err) => console.log("err", err));
  };

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
    setOpenCamera(false);

    clearInterval(timerRef.current);
  };


  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
    }, (error) => {
      console.log("Error getting location:", error);
    });
  };

  const closeHandler = () => {
    // let photo = photoRef.current;
    // let ctx = photo.getContext("2d");
    // ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);

    setOpenCamera(false);
    clearInterval(timerRef.current);
  };

  const openCameraWithTimer = () => {

    // setOpenCamera(!openCamera)
// timerRef.current = setInterval(() => {
      navigator.permissions.query({ name: 'camera' })
        .then((cameraPermission) => {
          if (cameraPermission.state === "granted") {
            getLocation();
            openCameraWithTimer();
          } else if (cameraPermission.state === "prompt") {
            navigator.mediaDevices.getUserMedia({ video: true })
              .then(() => {
                getLocation();
                openCameraWithTimer();
              })
              .catch((error) => {
                console.log("Error accessing camera:", error);
              });
          } else {
            console.log("Camera permission denied");
          }
        })
        .catch((error) => {
          console.log("Error querying camera permission:", error);
        });
    // })
    
    setVideoClosed(false); // Reset the videoClosed flag to false when opening the camera again
    setOpenCamera(true);
  
  };




  useEffect(() => {
    if (openCamera && !videoClosed) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(30);
    }
  }, [openCamera,videoClosed]);

  useEffect(() => {
    if (timer === 0) {
      closeHandler();
      setVideoClosed(true);
    }
  }, [timer]);

  return (
    <main className="App">
      <section className="main">
        <div className="camera-box">
          {openCamera  && !videoClosed  &&(
            <div
            // ${openCamera ? "showOn" : "showOff"}
              // ${cameraTimeout ? "showOn" : "showOff"}
              className={`camera showOn
            `}
            >
              <video ref={videoRef}></video>
              {openCamera && <p>{timer}s</p>}
              <button className="btn" onClick={takePhoto}>
                take pic
              </button>
            </div>
          )}

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            incidunt repudiandae porro ullam, quis inventore, culpa suscipit
            quibusdam laudantium sequi qui tempora quam assumenda ipsa.
          </p>
          <img src="../public/img/car.png" alt="car" />
          {/* <button className="btn" onClick={takePhoto}> */}
          {/* <button className="btn" onClick={() => setOpenCamera(!openCamera)}> */}
          <button className="btn" onClick={openCameraWithTimer}>
            open camera
          </button>
        </div>

        { !videoClosed && <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
          <canvas ref={photoRef}></canvas>
          <button className="btn" onClick={closeHandler}>
            close
          </button>
        </div>}
      </section>
    </main>
  );
}

export default App;
