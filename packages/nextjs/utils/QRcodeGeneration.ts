import fs from "fs";
import QRCode from "qrcode";

// Load the DID document from a file
// export function loadDIDDocument(filePath: any) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) reject(err);
//       else resolve(data);
//     });
//   });
// }

// Generate QR code and save it to a file

export async function generateQRCode(jsonf: string) {
  try {
    const generateQR = async (text: any) => {
      try {
        await QRCode.toDataURL(text);
      } catch (err) {
        console.error(err);
      }
    };

    // const data = await fs.promises.readFile(jsonf, "utf-8");
    // await generateQR(jsonf);
    return QRCode.toDataURL(jsonf);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}

// generateQRCode(jsoo);
