import { getJson } from '../shared/api/http-client.js';

export const USERS_LIMIT = 8;

/** Gọi API danh sách người dùng — dùng chung cho cả bản "before" và "after". */
export async function fetchUsers({ signal } = {}) {
  const data = await getJson(
    `/users?limit=${USERS_LIMIT}&select=id,firstName,lastName,email,image,company`,
    { signal },
  );
  return data.users;
}
