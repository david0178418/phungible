import { createContext } from 'react';
import { User } from 'firebase/app';
import { Account, UserMeta, Profile, Budget } from './interfaces';

export
const UserContext = createContext<User | null>(null);

export
const UserMetaContext = createContext<UserMeta | null>(null);

export
const ProfileContext = createContext<Profile | null>(null);

export
const AccountsContext = createContext<Account[]>([]);

export
const BudgetContext = createContext<Budget[]>([]);
