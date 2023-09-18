import logo from "./logo.svg";
import "./App.css";
import mqtt from "precompiled-mqtt";
import { useEffect, useState } from "react";

function App() {
  const URL_MQTT = "mqtt://test.mosquitto.org:8081";
  const topicToSubscribe = "/luthfi123";

  let [client, setclient] = useState(null);
  let [publishText, setPublishText] = useState("");
  let [isIntruder, setIsIntruder] = useState(false);

  const handlePublishText = () => {
    if (!client) return;

    client.publish(topicToSubscribe, publishText, (err) => {
      if (err) console.log(err);
    });
  };

  const handleIncomingMessage = (text) => {
    if (text == 1) {
      setIsIntruder(true);
    } else {
      setIsIntruder(false);
    }
  };

  const handleMatikanAlarm = () => {
    client.publish(topicToSubscribe, "3", (err) => {
      if (err) return alert("Gagal mematikan alarm!");
      setIsIntruder(false);
    });
  };

  useEffect(() => {
    let clientTemp = mqtt.connect(URL_MQTT);

    clientTemp.on("connect", () => {
      clientTemp.subscribe(topicToSubscribe, () => {
        setclient(clientTemp);
        console.log(`Connected to Topic ${topicToSubscribe}`);
      });
    });

    return () => {
      clientTemp.end();
      console.log("Disconnected");
      setclient(null);
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on("message", (topic, message) => {
        handleIncomingMessage(message);
      });
    }

    return () => {
      client?.end();
    };
  }, [client]);

  return (
    <div
      className="App"
      style={{ width: "100vw", height: "100vh", backgroundColor: "#222831" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            width: "60%",
            backgroundColor: isIntruder ? "red" : "green",
          }}
        >
          <h1 style={{ color: "white" }}>
            {isIntruder ? "Gerakan Terdeteksi" : "Tidak Ada Gerakan Terdeteksi"}
          </h1>
          <h3>Status Alarm : {`${isIntruder ? "Nyala" : "Mati"}`}</h3>
        </div>
        <button
          style={{ fontSize: "1rem", padding: "1rem 2rem" }}
          onClick={handleMatikanAlarm}
        >
          Matikan Alarm
        </button>
      </div>
    </div>
  );
}

export default App;
