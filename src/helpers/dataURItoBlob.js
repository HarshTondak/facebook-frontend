export default function dataURItoBlob(dataURI) {
  var byteString; // Will store the binary data extracted from the dataURI.

  // checks if the data URI contains "base64" encoding
  if (dataURI.split(",")[0].indexOf("base64") >= 0) {
    // If it does, it decodes the data URI using the "atob()"[ASCII to binary]
    byteString = atob(dataURI.split(",")[1]);
  } else {
    // If not, it uses decodeURI() to decode the data URI.
    // It is used to decode escape sequences in a string(handling special characters in URLs)
    byteString = decodeURI(dataURI.split(",")[1]);
  }

  // Storing the file format
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // Writing the bytes of the string to a typed array
  // "Uint8Array" is a typed array that represents an array of 8-bit unsigned integers, which is suitable for handling binary data.
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Returning a Blob object
  return new Blob([ia], { type: mimeString });
}
