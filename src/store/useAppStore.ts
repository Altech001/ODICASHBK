import { create } from 'zustand';

export interface CashEntry {
  id: string;
  date: string;
  time: string;
  details: string;
  contactName: string;
  contactType: string;
  category: string;
  mode: string;
  bill: string;
  amount: number;
  type: 'in' | 'out';
  createdBy: string;
}

export interface CashBook {
  id: string;
  name: string;
  members: number;
  updatedAt: string;
  entries: CashEntry[];
  entryFields: {
    contact: boolean;
    category: boolean;
    paymentMode: boolean;
    customFields: boolean;
  };
  dataOperatorRole: {
    backdatedEntries: 'always' | 'never' | 'one_day';
    entryEditPermission: boolean;
    hideNetBalance: boolean;
    hideEntriesByOthers: boolean;
  };
}

export interface Business {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Primary Admin' | 'Admin' | 'Employee';
  avatar: string;
}

interface AppState {
  businesses: Business[];
  activeBusinessId: string;
  books: CashBook[];
  teamMembers: TeamMember[];
  selectedEntryId: string | null;
  setSelectedEntryId: (id: string | null) => void;
  addBusiness: (name: string) => void;
  setActiveBusinessId: (id: string) => void;
  addBook: (name: string) => void;
  renameBook: (bookId: string, name: string) => void;
  duplicateBook: (bookId: string) => void;
  deleteBook: (bookId: string) => void;
  addEntry: (bookId: string, entry: Omit<CashEntry, 'id'>) => void;
  deleteEntry: (bookId: string, entryId: string) => void;
  moveEntry: (fromBookId: string, toBookId: string, entryId: string) => void;
  copyEntry: (fromBookId: string, toBookId: string, entryId: string) => void;
  copyOppositeEntry: (fromBookId: string, toBookId: string, entryId: string) => void;
  updateEntryFields: (bookId: string, fields: Partial<CashBook['entryFields']>) => void;
  updateDataOperatorRole: (bookId: string, role: Partial<CashBook['dataOperatorRole']>) => void;
  renameBusiness: (businessId: string, name: string) => void;
}

const defaultEntryFields = { contact: true, category: true, paymentMode: true, customFields: false };
const defaultDataOperatorRole = { backdatedEntries: 'always' as const, entryEditPermission: false, hideNetBalance: false, hideEntriesByOthers: false };

export const useAppStore = create<AppState>((set, get) => ({
  businesses: [{ id: '1', name: 'Tresa' }],
  activeBusinessId: '1',
  selectedEntryId: null,
  books: [
    {
      id: '1',
      name: 'Business Book',
      members: 2,
      updatedAt: 'Updated 5 days ago',
      entryFields: { ...defaultEntryFields },
      dataOperatorRole: { ...defaultDataOperatorRole },
      entries: [
        {
          id: 'e1',
          date: '11 Feb, 2026',
          time: '01:13 AM',
          details: '(Altech Albert) (Customer)',
          contactName: 'Altech Albert',
          contactType: 'Customer',
          category: 'Sale',
          mode: 'Cash',
          bill: '',
          amount: 1000,
          type: 'in',
          createdBy: 'You',
        },
      ],
    },
    {
      id: '2',
      name: 'Tresa',
      members: 2,
      updatedAt: 'Updated 5 days ago',
      entryFields: { ...defaultEntryFields },
      dataOperatorRole: { ...defaultDataOperatorRole },
      entries: [],
    },
  ],
  teamMembers: [
    { id: '1', name: 'You', email: 'albertabaasa07@gmail.com', role: 'Primary Admin', avatar: 'A' },
    { id: '2', name: 'John', email: 'altechalbert01@gmail.com', role: 'Admin', avatar: 'J' },
  ],

  setSelectedEntryId: (id) => set({ selectedEntryId: id }),

  addBusiness: (name) =>
    set((state) => ({
      businesses: [...state.businesses, { id: Date.now().toString(), name }],
    })),

  setActiveBusinessId: (id) => set({ activeBusinessId: id }),

  addBook: (name) =>
    set((state) => ({
      books: [
        ...state.books,
        {
          id: Date.now().toString(),
          name,
          members: 1,
          updatedAt: 'Just now',
          entryFields: { ...defaultEntryFields },
          dataOperatorRole: { ...defaultDataOperatorRole },
          entries: [],
        },
      ],
    })),

  renameBook: (bookId, name) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === bookId ? { ...b, name } : b)),
    })),

  duplicateBook: (bookId) =>
    set((state) => {
      const book = state.books.find((b) => b.id === bookId);
      if (!book) return state;
      return {
        books: [
          ...state.books,
          { ...book, id: Date.now().toString(), name: `${book.name} (Copy)`, entries: [...book.entries] },
        ],
      };
    }),

  deleteBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== bookId),
    })),

  addEntry: (bookId, entry) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId ? { ...b, entries: [...b.entries, { ...entry, id: Date.now().toString() }] } : b
      ),
    })),

  deleteEntry: (bookId, entryId) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId ? { ...b, entries: b.entries.filter((e) => e.id !== entryId) } : b
      ),
      selectedEntryId: null,
    })),

  moveEntry: (fromBookId, toBookId, entryId) =>
    set((state) => {
      const fromBook = state.books.find((b) => b.id === fromBookId);
      const entry = fromBook?.entries.find((e) => e.id === entryId);
      if (!entry) return state;
      return {
        books: state.books.map((b) => {
          if (b.id === fromBookId) return { ...b, entries: b.entries.filter((e) => e.id !== entryId) };
          if (b.id === toBookId) return { ...b, entries: [...b.entries, { ...entry, id: Date.now().toString() }] };
          return b;
        }),
        selectedEntryId: null,
      };
    }),

  copyEntry: (fromBookId, toBookId, entryId) =>
    set((state) => {
      const fromBook = state.books.find((b) => b.id === fromBookId);
      const entry = fromBook?.entries.find((e) => e.id === entryId);
      if (!entry) return state;
      return {
        books: state.books.map((b) => {
          if (b.id === toBookId) return { ...b, entries: [...b.entries, { ...entry, id: Date.now().toString() }] };
          return b;
        }),
      };
    }),

  copyOppositeEntry: (fromBookId, toBookId, entryId) =>
    set((state) => {
      const fromBook = state.books.find((b) => b.id === fromBookId);
      const entry = fromBook?.entries.find((e) => e.id === entryId);
      if (!entry) return state;
      const oppositeEntry = { ...entry, id: Date.now().toString(), type: entry.type === 'in' ? 'out' as const : 'in' as const };
      return {
        books: state.books.map((b) => {
          if (b.id === toBookId) return { ...b, entries: [...b.entries, oppositeEntry] };
          return b;
        }),
      };
    }),

  updateEntryFields: (bookId, fields) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId ? { ...b, entryFields: { ...b.entryFields, ...fields } } : b
      ),
    })),

  updateDataOperatorRole: (bookId, role) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId ? { ...b, dataOperatorRole: { ...b.dataOperatorRole, ...role } } : b
      ),
    })),
  renameBusiness: (businessId, name) =>
    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId ? { ...b, name } : b
      ),
    })),
}));
