import { Col, Row } from "react-bootstrap";
import styles from "./Chat.module.css";
export default function Chat({ messages, curUser }) {
  const classes = `d-flex flex-column align-items-center overflow-auto`;
  return (
    <Col xs={12} xxl={9} className={classes}>
      {messages.map((message, index) => (
        <Row xs={2} key={index} className="w-100">
          {message.user === curUser ? (
            <>
              <Col></Col>
              <Col>
                <p className={styles.userName}>{"Ты"}</p>
                <h4 className={styles.msgBg}>{message.message}</h4>
              </Col>
            </>
          ) : (
            <>
              <Col>
                <p className={styles.userName}>{message.user}</p>
                <h4 className={styles.msgBg}>{message.message}</h4>
              </Col>
              <Col></Col>
            </>
          )}
        </Row>
      ))}
    </Col>
  );
}
