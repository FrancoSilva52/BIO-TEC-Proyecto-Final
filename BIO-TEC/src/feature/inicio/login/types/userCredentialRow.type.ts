export type UserCredentialRow = {
  id: string;
  username: string;
  full_name: string;
  profile_photo_data_url: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  is_active: number;
};