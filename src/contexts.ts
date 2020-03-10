import { createContext } from 'react';
import { User } from 'firebase/app';
import { Account } from './interfaces';

export
const UserContext = createContext<User | null>(null);

export
const AccountsContext = createContext<Account[]>([]);
