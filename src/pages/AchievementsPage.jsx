import React, { useState, useMemo, useEffect } from 'react';
import { achievementsData } from '../data/achievementsData';
import AchievementCard from '../components/achievements/AchievementCard';
import AchievementModal from '../components/achievements/AchievementModal';
import PaginationBar from '../components/ui/PaginationBar';
import { ArrowLeft, Search, Sparkles, Code2, GraduationCap, Trophy, X, Layers } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'All', label: 'All Achievements', icon: Layers },
  { id: 'Hackathons', label: 'Hackathons', icon: Code2 },
  { id: 'Academic Achievement', label: 'Academic Achievement', icon: GraduationCap },
  { id: 'Extracurricular', label: 'Extracurricular', icon: Trophy },
];

export default function AchievementsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16; // 4 rows of 4-column grid

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter achievements based on active tab and search query
  const filteredAchievements = useMemo(() => {
    return achievementsData.filter((item) => {
      // Category Tab Filter
      if (activeTab !== 'All' && item.tag !== activeTab) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchStudent = item.studentName?.toLowerCase().includes(query);
        const matchReg = item.registerNumber?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchLevel = item.level?.toLowerCase().includes(query);
        const matchYear = item.year?.toLowerCase().includes(query);

        if (!matchTitle && !matchStudent && !matchReg && !matchDesc && !matchLevel && !matchYear) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Reset page to 1 whenever active tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE) || 1;
  const paginatedAchievements = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAchievements.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAchievements, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      if (onNavigate) onNavigate('home');
      else window.location.hash = '#achievements';
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-red-600/30">
      {/* Sticky Top Navigation & Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-800/80">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-600/60 font-mono text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} className="text-red-500" />
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* Centered Page Hero Branding Header */}
        <div className="mt-8 mb-10 text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-7xl text-red-600 tracking-tight text-center">
            Achievements
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto">
            A collection of academic, co-curricular and extra-curricular achievements reflecting student passion, hard work, and dedication across Jyothi Engineering College.
          </p>
        </div>

        {/* Filter Controls Bar (Category Tabs + Search Bar) */}
        <div className="bg-[#0e0e16]/90 border border-neutral-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 border border-red-500/40 scale-[1.02]'
                      : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search achievement..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 font-mono text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      <div className="max-w-7xl mx-auto">
        {filteredAchievements.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onViewDetails={(item) => setSelectedAchievement(item)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-20 px-4 bg-[#0e0e16]/60 border border-neutral-800/80 rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
              <Search size={28} />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">No achievements found</h3>
            <p className="text-neutral-400 text-xs font-mono max-w-sm mx-auto leading-relaxed">
              We couldn't find any achievements matching your search criteria. Try clearing filters or using different keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
}
