export interface CreateUserRequest {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface DeleteUserRequest {
  uid: string;
}
