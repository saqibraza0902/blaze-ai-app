import RNBlobUtil from 'react-native-blob-util';

export const fileToByteArray = async (
  fileUri: string,
  returnType: 'array' | 'uint8array' | 'arraybuffer' = 'array',
) => {
  const path = fileUri.replace('file://', '');
  const base64Data = await RNBlobUtil.fs.readFile(path, 'base64');
  const binary = atob(base64Data);
  const len = binary.length;

  // Create Uint8Array first (most efficient)
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }

  // Return based on requested type
  switch (returnType) {
    case 'array':
      return Array.from(uint8Array);
    case 'uint8array':
      return uint8Array;
    case 'arraybuffer':
      return uint8Array.buffer;
    default:
      return uint8Array;
  }
};
