// hooks/useFilePicker.ts
import {useState} from 'react';
import {pick, keepLocalCopy} from '@react-native-documents/picker';

export interface PickedFile {
  uri: string;
  name: string;
  type: string | null;
  size: number | null;
  fileCopyUri?: string;
}

export const useFilePicker = () => {
  const [file, setFile] = useState<PickedFile | null>(null);

  const pickFile = async () => {
    try {
      const [res] = await pick({
        type: ['*/*'], // all files
      });

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: res.uri,
            fileName: res.name ?? 'unnamed',
          },
        ],
        destination: 'documentDirectory',
      });

      if (localCopy.status === 'success') {
        const pickedFile: PickedFile = {
          uri: localCopy.localUri,
          name: res.name ?? 'unnamed',
          type: res.type ?? null,
          size: res.size ?? null,
          fileCopyUri: localCopy.localUri,
        };

        setFile(pickedFile);
        return pickedFile;
      } else {
        console.error('Copy failed:', localCopy.copyError);
        return null;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('File picker cancelled');
      } else {
        console.error('Error picking file:', err);
      }
      return null;
    }
  };

  return {file, pickFile};
};
