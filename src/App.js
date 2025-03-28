import axios from "axios";
import "./App.css";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";

async function sendMsg(message, authData) {
  try {
    const response = await axios.post(
      "http://192.168.222.51:4000/send",
      { message: message, authData: authData },
      { timeout: 2000 }
    );
    return response.status;
  } catch (error) {
    return error.message;
  }
}

async function deleteUser(user, authData) {
  try {
    const response = await axios.post(
      "http://192.168.222.51:4000/deluser",
      { user: user, authData: authData },
      { timeout: 2000 }
    );
    return response.status;
  } catch (error) {
    return error.message;
  }
}

async function getMsgs(authData) {
  try {
    const response = await axios.post(
      "http://192.168.222.51:4000/load",
      authData,
      {
        timeout: 2000,
      }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
}

async function delAllMsgs(authData) {
  try {
    const response = await axios.post(
      "http://192.168.222.51:4000/del",
      authData,
      {
        timeout: 2000,
      }
    );
    return response;
  } catch (error) {
    return error.message;
  }
}

async function isValidAuthData(authData) {
  try {
    const response = await axios.post(
      "http://192.168.222.51:4000/auth",
      authData,
      {
        timeout: 2000,
      }
    );
    return response.data.isValid;
  } catch (error) {
    return error.message;
  }
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(["Загрузка..."]);
  const [isControls, setIsControls] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    "/android-chrome-192x192.png"
  );
  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(false);

  const [delUser, setDelUser] = useState("");

  const [logOrReg, setLogOrReg] = useState("log");

  useEffect(() => {
    const fetchMessages = async () => {
      const loadedMsgs = await getMsgs(authData);
      console.log(loadedMsgs);
      if (Array.isArray(loadedMsgs)) setMessages(loadedMsgs);
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [authData]);

  const reservedCmds = {
    clear: delAllMsgs,
  };

  async function sendMsgHandler(e) {
    e.preventDefault();
    await sendMsg(e.target.message.value, authData);
  }

  useEffect(() => {
    (async () => {
      const isValid = await isValidAuthData(authData);
      setStatus(isValid);
    })();
  }, [authData]);

  return (
    <div className="App">
      <div className="container-fluid">
        {status ? (
          <Row>
            <Col
              xs={12}
              xxl={3}
              className="d-flex flex-column align-items-center mb-4"
            >
              <img className="mt-4" src={currentImage} width={100} />
              <h2 className="mt-4">Секретный канал связи...🤫</h2>
              <form
                onSubmit={async (e) => {
                  setInputValue("");
                  await sendMsgHandler(e);
                }}
                className="d-flex mt-2"
              >
                <input
                  type="text"
                  name="message"
                  value={inputValue}
                  onChange={(e) => {
                    const curValue = e.target.value;
                    if (curValue in reservedCmds && status === "admin") {
                      setInputValue("");
                      reservedCmds[curValue](authData);
                      return;
                    }
                    setInputValue(curValue);
                  }}
                  className="form-control"
                />
                <button type="submit" className="btn btn-dark cursor-pointer">
                  send
                </button>
              </form>
              {status === "admin" && (
                <button
                  className="mt-4 btn btn-warning cursor-pointer"
                  onClick={() => setIsControls(!isControls)}
                >
                  Админка
                </button>
              )}
              {isControls && (
                <div className="mt-3">
                  {/* <input type="file" accept="image/*" capture="environment" /> */}
                  <div className="d-flex mt-2">
                    <input
                      type="text"
                      value={delUser}
                      onChange={(e) => setDelUser(e.target.value)}
                      className="form-control"
                      placeholder="Удалить чувака..."
                    />
                    <button
                      type="submit"
                      className="btn btn-dark cursor-pointer"
                      onClick={async () => {
                        await deleteUser(delUser, authData);
                        setDelUser("");
                      }}
                    >
                      Пока!
                    </button>
                  </div>
                </div>
              )}
            </Col>
            <Chat messages={messages} curUser={authData.username} />
          </Row>
        ) : (
          <Row>
            <Col className="d-flex flex-column align-items-center mb-4">
              {logOrReg === "log" ? (
                <>
                  <h1 className="mt-4">Авторизуйся</h1>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const username = e.target.username.value;
                      const password = e.target.password.value;
                      if (username.trim() && password.trim())
                        setAuthData({ username: username, password: password });
                    }}
                    className="d-flex mt-2"
                  >
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                    />
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                    />
                    <button
                      type="submit"
                      className="btn btn-dark cursor-pointer"
                    >
                      Всё
                    </button>
                  </form>
                  <a
                    className="mt-1 cursor-pointer"
                    onClick={() => setLogOrReg("reg")}
                  >
                    Или зарегайся
                  </a>
                </>
              ) : (
                <>
                  <h1 className="mt-4">Зарегайся</h1>
                  <a
                    className="mt-1 cursor-pointer"
                    onClick={() => setLogOrReg("log")}
                  >
                    Все таки логин
                  </a>
                </>
              )}
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default App;
