
import { useState } from 'react';
import draftsData from '../../../../utils/fetchDrafts';
import searchIcon from '../../../../assets/icons/searchIcon.svg';

function Drafts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastEdited');

  const filteredDrafts = draftsData.filter(draft =>
    draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDrafts = filteredDrafts.sort((a, b) => {
    if (sortBy === 'lastEdited') {
      return new Date(b.lastEdited) - new Date(a.lastEdited);
    } else if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <main className="min-h-screen bg-layout-elements">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-font mb-3 tracking-tight">
            My Drafts
          </h1>
          <p className="text-lg text-font-light max-w-2xl">
            Continue where you left off and bring your ideas to life
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="bg-layout-elements-focus rounded-2xl shadow-sm border border-gray-600 p-6 mb-12 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <img src={searchIcon} alt="Search" className="w-5 h-5 opacity-70" />
              </div>
              <input
                type="text"
                placeholder="Search drafts by title or content..."
                className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-font placeholder-font-light bg-layout-elements hover:bg-layout-elements-focus focus:bg-layout-elements-focus"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 min-w-fit">
              <label className="text-sm font-medium text-font-light whitespace-nowrap">
                Sort by:
              </label>
              <select
                className="px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-font bg-layout-elements hover:bg-layout-elements-focus cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastEdited">Last Edited</option>
                <option value="date">Creation Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex flex-col gap-10 w-full">
          {sortedDrafts.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            sortedDrafts.map(draft => (
              <DraftCard key={draft.id} draft={draft} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function DraftCard({ draft }) {
  return (
    <article className="w-full bg-layout-elements-focus rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-600 overflow-hidden group hover:border-blue-400 transform hover:-translate-y-1 backdrop-blur-sm">
      <div className="p-8 xl:p-10">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Left side - Main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-font mb-3 group-hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                {draft.title}
              </h2>

            
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {draft.department}
                </span>
                <time className="text-font-light flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {draft.lastEdited} ago
                </time>
              </div>
            </div>

            {/* Content Preview */}
            <div>
              <p className="text-font-light leading-relaxed line-clamp-6 text-base">
                {draft.content}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col justify-center gap-4 min-w-[220px]">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
              Edit Draft
            </button>
            <button className="bg-transparent hover:bg-layout-elements text-font font-medium py-3 px-6 rounded-lg border border-gray-600 hover:border-blue-400 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
              Publish
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-layout-elements-focus rounded-full flex items-center justify-center mb-6 border border-gray-600">
        <svg className="w-12 h-12 text-font-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-font mb-2">
        {searchTerm ? 'No drafts found' : 'No drafts yet'}
      </h3>
      <p className="text-font-light max-w-md mx-auto mb-6">
        {searchTerm
          ? `No drafts match your search for "${searchTerm}". Try different keywords.`
          : 'Start creating your first draft to see it here.'}
      </p>
      {!searchTerm && (
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
          Create New Draft
        </button>
      )}
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-6 {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

export default Drafts;