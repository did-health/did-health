import { Web3Storage } from "web3.storage";
import { File } from "web3.storage";
import { getFilesFromPath } from "web3.storage";

const token: string = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN as string;
console.log(token)
function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRhRTU2QzgxNjQyNmI4QUVjREUzODE4YzAzOTJFY0ZhNDAyQjRGQWEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTU4MDIxNzA1MTgsIm5hbWUiOiJkaWQ6aGVhbHRoIn0.TeizBmnPo-4yPx2n14ibsn1haZDFyuiTl0DyCZ6wRg0"
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function getFiles(path: any) {
  const files = await getFilesFromPath(path);
  console.log(`read ${files.length} file(s) from ${path}`);
  return files;
}

export function makeFileObjects() {
  // You can create File objects from a Buffer of binary data
  // see: https://nodejs.org/api/buffer.html
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: "world" };
  const buffer = Buffer.from(JSON.stringify(obj));

  const files = [new File(["contents-of-file-1"], "plain-utf8.txt"), new File([buffer], "hello.json")];
  return files;
}
