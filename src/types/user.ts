export interface User {
  matricule: string;
  role: string;
  name: string;
  password: string;
}

export interface Users {
  [key: string]: User;
} 