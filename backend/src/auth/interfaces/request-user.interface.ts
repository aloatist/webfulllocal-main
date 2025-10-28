export interface RequestUser {
  id: string;
  email: string;
  status: string;
  roles: {
    id: string;
    code: string;
    name: string;
  }[];
  permissions: string[];
}
