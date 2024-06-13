export interface CreateUserRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface DeleteUserRequest {
  uid: string;
}
