export type User = {
  name: string;
  avatar: string;
  email: string;
  status: boolean;
  role: string;
  lastLogin: Date;
  id: number;
};

type Info = {
  name: string;
  avatar: string;
  email: string;
};

export type UserTableData = {
  info: Info;
  status: string;
  role: string;
  lastLogin: any;
  methods: {
    id: number;
    delete: (id: number) => void;
    edit: (id: number) => void;
  };
};
