import { Search, Plus, Pencil, Copy, UserPlus, ArrowRight, ChevronDown, MessageCircle, Library, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CashbooksPage = () => {
  const { books, businesses, activeBusinessId, addBook } = useAppStore();
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const filteredBooks = books.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalBalance = (book: typeof books[0]) =>
    book.entries.reduce((sum, e) => sum + (e.type === 'in' ? e.amount : -e.amount), 0);

  const quickBooks = ['February Expenses', 'Cash Journal', 'Payable Book', 'Project Book'];

  return (
    <div className="flex-1 flex bg-white">
      <div className="flex-1 p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{activeBusiness?.name}</h1>
          <button
            onClick={() => navigate('/team')}
            className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-blue-600 font-semibold hover:bg-slate-50 transition-colors bg-white"
          >
            <Users className="w-4 h-4" />
            Business Team
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center mb-10">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[340px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by book name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 border border-slate-100 rounded px-1.5 py-0.5">/</span>
            </div>


            {/* Business Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-slate-700 border border-slate-200 rounded-md px-4 py-2 bg-white hover:bg-slate-50 transition-colors">
                Sort By: Name (A to Z)
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-slate-200 rounded-md z-50">
                  <div className="max-h-[200px] overflow-y-auto">
                    {quickBooks.map((biz) => (
                      <button
                        key={biz.slice(0, 1)}

                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent text-left',
                          biz === activeBusinessId && 'text-primary font-medium'
                        )}
                        onClick={() => navigate(`/cashbooks/${biz}`)}
                      >
                        <div className={cn(
                          'w-3 h-3 rounded-full border-2',
                          biz === activeBusinessId ? 'border-primary bg-primary' : 'border-muted-foreground'
                        )} />
                        {biz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <button
            onClick={() => {
              const name = prompt('Enter book name:');
              if (name) addBook(name);
            }}
            className="flex items-center gap-2 bg-[#4361ee] text-white rounded-md px-6 py-2.5 text-sm font-bold hover:opacity-90 shadow-sm transition-all ml-4"
          >
            <Plus className="w-5 h-5 stroke-[2.5px]" />
            Add New Book
          </button>
        </div>

        {/* Book List */}
        <div className="space-y-0 border-t border-slate-100">
          {filteredBooks.map((book) => {
            const balance = totalBalance(book);
            return (
              <div
                key={book.id}
                className="flex items-center justify-between py-5 border-b border-slate-100 group hover:bg-slate-50/50 cursor-pointer px-2 -mx-2 rounded transition-colors"
                onClick={() => navigate(`/cashbooks/${book.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-800">{book.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {book.members} members • {book.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[15px] font-bold text-[#10b981] min-w-[70px] text-right">
                    {balance.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-4 text-blue-600">
                    <Pencil className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); }} />
                    <Copy className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); }} />
                    <UserPlus className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); }} />
                    <ArrowRight className="w-4 h-4 cursor-pointer text-[#ef4444] hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Section */}
        <div className="mt-8 p-6 bg-white border border-slate-100 rounded">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-blue-100">
              <Library className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-slate-800">Add New Book</p>
              <p className="text-sm text-slate-500">Click to quickly add books for</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {quickBooks.map((name) => (
              <button
                key={name}
                onClick={() => addBook(name)}
                className="text-xs font-medium text-blue-600 rounded-full px-4 py-2 hover:bg-blue-100 border border-blue-100 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] border-l border-slate-100 p-8 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col items-start">
          <h3 className="text-[14px] font-medium text-slate-800 mb-2 leading-snug">
            Need help in business setup?
          </h3>
          <p className="text-[12px] text-slate-500 mb-6 font-medium">
            Our support team will help you
          </p>
          <button className="text-[12px] text-blue-600 font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all">
            Contact Us <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashbooksPage;
