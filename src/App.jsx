import logo from "./logo.svg";
import "./App.css";
import mqtt from "precompiled-mqtt";
import { useEffect, useState } from "react";

function App() {
  const URL_MQTT = "mqtt://test.mosquitto.org:8081";
  const topicToSubscribe = "/AnnexTest";

  let [client, setclient] = useState(null);
  let [publishText, setPublishText] = useState("");

  const handlePublishText = () => {
    if (!client) return;

    client.publish(topicToSubscribe, publishText, (err) => {
      if (err) console.log(err);
    });
  };

  useEffect(() => {
    let clientTemp = mqtt.connect(URL_MQTT);

    clientTemp.on("connect", () => {
      clientTemp.subscribe("/AnnexTest", () => {
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
        console.log(message.toString());
      });
    }

    return () => {
      client?.end();
    };
  }, [client]);

  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => setPublishText(e.target.value)}
        value={publishText}
      />
      <button onClick={handlePublishText}>Publish Text</button>
    </div>
  );
}

export default App;
