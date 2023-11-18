import { useEffect, useRef, useState } from "react";

function App() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const [timer, setTimer] = useState(30);
  const [videoClosed, setVideoClosed] = useState(false);
  const timerRef = useRef(null);

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  // const getVideo = () => {
  //   const videoConstraints = {
  //     video: {
  //       facingMode: { exact: 'environment' },
  //       width: { ideal: 430 },
  //       height: { ideal: 600 }
  //     }
  //   };

  //   navigator.mediaDevices.getUserMedia(videoConstraints)
  //     .then((stream) => {
  //       let video = videoRef.current;
  //       video.srcObject = stream;
  //       video.play();
  //     })
  //     .catch((error) => {
  //       console.log('Error accessing camera:', error);
  //     });
  // };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 430 },
          height: { ideal: 900 },
        },
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
    // const height = window.innerHeight;

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
      });
    } else {
      console.log("Geo Location not supported by browser");
    }
  };

  const closeHandler = () => {
    setHasPhoto(false);

    setOpenCamera(false);
    clearInterval(timerRef.current);
  };

  const openCameraWithTimer = () => {
    setOpenCamera(!openCamera);

    //  timerRef.current = setInterval(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((locationPermission) => {
        console.log(locationPermission);
        if (locationPermission.state === "granted") {
          getLocation();
          // openCameraWithTimer();
          requestCamera();
        } else if (locationPermission.state === "prompt") {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(() => {
              getLocation();
              requestCamera();
              // openCameraWithTimer();
            })
            .catch((error) => {
              console.log("Error accessing camera:", error);
              setOpenCamera(false);
            });
        } else {
          console.log("Camera permission denied");
          setOpenCamera(false);
        }
      })
      .catch((error) => {
        console.log("Error querying camera permission:", error);
      });
    // });

    setVideoClosed(false);
    setOpenCamera(true);
  };

  const requestCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        getVideo();
      })
      .catch((error) => {
        console.log("Error accessing camera:", error);
        setOpenCamera(false);
      });
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
  }, [openCamera, videoClosed]);

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
          {/* {openCamera && ( */}
          <div
            // ${cameraTimeout ? "showOn" : "showOff"}
            className={`camera 
              ${openCamera ? "showOn" : "showOff"}
            `}
          >
            <video ref={videoRef}></video>
            {openCamera && <p>{timer}s</p>}
            <button className="btn" onClick={takePhoto}>
              take pic
            </button>
          </div>
          {/* )} */}

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

        {!videoClosed && (
          <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
            <canvas ref={photoRef}></canvas>
            <button className="btn" onClick={closeHandler}>
              close
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
