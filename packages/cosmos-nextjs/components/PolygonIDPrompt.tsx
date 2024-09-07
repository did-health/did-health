//Based on https://codesandbox.io/s/generate-qrcode-with-json-data-forked-p9f823?file=/index.js:0-786
import React from "react";
const data =  "./qrValueProofRequestExample.json";
import { QRCode } from "react-qr-svg";

const styles = {
  root: {
    fontFamily: "sans-serif",
  },
  h1: {
    textAlign: "center",
  },
  qrcode: {
    display: "flex",
    padding: "2.3em",
  },
} as const;

function PolygonIDPrompt() {
  return (
    <div style={styles.root}>
      <div style={styles.qrcode} className="flex justify-center items-center">
        <QRCode level="Q" style={{ height: "300px" }} value={JSON.stringify(data)} />
      </div>
    </div>
  );
}
export default PolygonIDPrompt;