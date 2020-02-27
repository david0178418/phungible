import { createContext } from 'react';
import { User } from 'firebase/app';

export
const UserContext = createContext<User | null>(null);
