export const api =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dev.blazeai.io';
interface IAssignFolderAdmin {
  token: string;
  id: number | string;
  uid: string;
}
interface IUCData {
  conversation_id: string;
  max_cascade: number;
  delay_seconds: number;
}
export const list_conversations = async (token: string) => {
  try {
    const res = await fetch(`${api}/api/list_conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return console.log('error');
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
export const single_conversation = async (token: string, id: string) => {
  const KEY = process.env.NEXT_PUBLIC_MEMBER_STACK_SECRET_KEY;
  try {
    const res = await fetch(
      `${api}/api/load_chat_history?conversation_id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': KEY as string,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      return console.log('error');
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
export const get_member = async (id: string) => {
  try {
    const res = await fetch(`${api}/member/${id}`);
    if (!res.ok) {
      return console.log('error');
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const get_folders = async (token: string) => {
  const res = await fetch(`${api}/api/folders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error);
  }
  return res.json();
};
export const create_folder = async (token: string, folderData: any) => {
  const res = await fetch(`${api}/api/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: folderData.name,
      color: folderData.color,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const delete_folder = async (token: string, id: number) => {
  const res = await fetch(`${api}/api/folders/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const edit_folder = async (
  token: string,
  folder: {id: number | null; name: string; color: string},
) => {
  const res = await fetch(`${api}/api/folders/${folder.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: folder.name,
      color: folder.color,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const move_convo_folder = async (
  token: string,
  fid: number,
  cid: string,
) => {
  const res = await fetch(`${api}/api/conversations/${cid}/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      folder_id: fid,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const get_news = async (id: number) => {
  const res = await fetch(`${api}/news/${id}`, {
    method: 'GET',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.text();
};
export const get_news_index = async () => {
  const res = await fetch(`${api}/news/latest`, {
    method: 'GET',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};

export const send_invite = async (token: string, body: any) => {
  const res = await fetch(`${api}/api/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({...body}),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const accept_invite = async (token: string, id: string) => {
  const res = await fetch(`${api}/api/accept-invite/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const folder_participants = async (token: string, id: number) => {
  const res = await fetch(`${api}/api/folder/${id}/participants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const convo_participants = async (token: string, id: string) => {
  const res = await fetch(`${api}/api/conversation/${id}/participants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const remove_folder_user = async (props: IAssignFolderAdmin) => {
  const {id, token, uid} = props;
  const res = await fetch(`${api}/api/folder/${id}/remove-participant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: uid,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const remove_convo_user = async (props: IAssignFolderAdmin) => {
  const {id, token, uid} = props;
  const res = await fetch(`${api}/api/conversation/${id}/remove-participant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: uid,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const assign_folder_admin = async (props: IAssignFolderAdmin) => {
  const {id, token, uid} = props;
  const res = await fetch(`${api}/api/folder/${id}/assign-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: uid,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const assign_convo_admin = async (props: IAssignFolderAdmin) => {
  const {id, token, uid} = props;
  const res = await fetch(`${api}/api/conversation/${id}/assign-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: uid,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const rename_conversation = async (
  token: string,
  id: string,
  name: string,
) => {
  const res = await fetch(`${api}/api/rename_conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      conversation_id: id,
      new_name: name,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const update_conversation_setting = async (
  token: string,
  data: IUCData,
) => {
  const res = await fetch(`${api}/api/update_conversation_settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const get_conversation_setting = async (token: string, id: string) => {
  const res = await fetch(
    `${api}/api/get_conversation_settings?conversation_id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};

export const get_vector_files = async (token: string) => {
  const res = await fetch(`${api}/api/vector_store/files/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const get_single_file = async (token: string, id: string) => {
  const res = await fetch(
    `${api}/api/vector_store/files/get_info?file_id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const search_file = async (
  token: string,
  id: string,
  query: string,
  max: number,
) => {
  const res = await fetch(`${api}/api/vector_store_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({user_id: id, query: query, max_results: max}),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const delete_file = async (token: string, id: string) => {
  const res = await fetch(
    `${api}/api/vector_store/files/delete?file_id=${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const retrieve_vector_store = async (token: string) => {
  const res = await fetch(`${api}/api/vector_store/retrieve`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};

interface IFeedback {
  rating: number;
  suggestions: string;
  plan_id: string;
  member_id: string;
}
export const submit_feedback = async (data: IFeedback, token: string) => {
  const res = await fetch(`${api}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
export const get_feedback = async (token: string) => {
  const res = await fetch(`${api}/api/feedback`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};
// utils/filePicker.ts
import {pick, keepLocalCopy} from '@react-native-documents/picker';

export interface PickedFile {
  uri: string;
  name: string;
  type: string | null;
  size: number | null;
  fileCopyUri?: string;
}
/* _________File */
type PickFileOptions = {
  maxSizeMB?: number; // optional limit in megabytes
};

export const pickSingleFile = async (
  options?: PickFileOptions,
): Promise<PickedFile | null> => {
  try {
    const [res] = await pick({
      type: ['*/*'],
    });

    if (
      options?.maxSizeMB &&
      res.size &&
      res.size > options.maxSizeMB * 1024 * 1024
    ) {
      console.warn(`File is larger than ${options.maxSizeMB}MB`);
      return null;
    }

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
      return {
        uri: localCopy.localUri,
        name: res.name ?? 'unnamed',
        type: res.type ?? null,
        size: res.size ?? null,
        fileCopyUri: localCopy.localUri,
      };
    } else {
      console.error('Copy failed:', localCopy.copyError);
      return null;
    }
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message?.includes('cancel')) {
      return null;
    } else {
      console.error('Error picking file:', err);
      return null;
    }
  }
};
