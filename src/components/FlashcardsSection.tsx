import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  CheckCircle2, 
  Shuffle, 
  Sparkles, 
  Search, 
  LayoutGrid, 
  CreditCard,
  Building,
  TrendingUp,
  Briefcase,
  FileText,
  Compass,
  Lightbulb,
  Check
} from 'lucide-react';
import { VOCAB_DATA, VocabWord } from '../data/vocabData';
import { playPronunciation } from '../utils/audio';

interface FlashcardsSectionProps {
  learnedWords: string[];
  onToggleLearned: (wordId: string) => void;
  onAwardCoins: (amount: number, reason: string) => void;
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({
  learnedWords,
  onToggleLearned,
  onAwardCoins
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = ['All', 'Planning & Design', 'Sales & Commercial', 'Investment & Finance', 'Legal & Milestone'];

  const categoryLabelsVi: Record<string, string> = {
    'All': 'Tất cả 🌟',
    'Planning & Design': 'Quy hoạch & Thiết kế 📐',
    'Sales & Commercial': 'Kinh doanh & Bán hàng 💼',
    'Investment & Finance': 'Đầu tư & Tài chính 📈',
    'Legal & Milestone': 'Pháp lý & Bàn giao 📜'
  };

  const filteredWords = useMemo(() => {
    return VOCAB_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredWords.length - 1));
  const currentWord: VocabWord | undefined = filteredWords[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(randomIndex);
  };

  const handleSpeak = (word: VocabWord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSpeakingId(word.id);
    playPronunciation(word.word);
    setTimeout(() => setSpeakingId(null), 1200);
  };

  const handleFlipCard = () => {
    const nextFlipState = !isFlipped;
    setIsFlipped(nextFlipState);
    if (nextFlipState && currentWord && !learnedWords.includes(currentWord.id)) {
      onAwardCoins(5, `Khám phá "${currentWord.word}"`);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Planning & Design': return <Compass className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />;
      case 'Sales & Commercial': return <Briefcase className="w-3.5 h-3.5 text-amber-600 stroke-[2.2]" />;
      case 'Investment & Finance': return <TrendingUp className="w-3.5 h-3.5 text-blue-600 stroke-[2.2]" />;
      case 'Legal & Milestone': return <FileText className="w-3.5 h-3.5 text-purple-600 stroke-[2.2]" />;
      default: return null;
    }
  };

  const progressPercentage = Math.round((learnedWords.length / VOCAB_DATA.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Category Pills & Search Bar - Hand-Drawn Notebook Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#fffefc] p-3.5 rounded-2xl border-2 border-stone-800 shadow-[3px_3px_0px_0px_#292524]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sketch tracking-wide whitespace-nowrap transition-all border-2 border-stone-800 ${
                selectedCategory === cat
                  ? 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_0px_#292524] -translate-y-0.5 font-bold'
                  : 'bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              {categoryLabelsVi[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input with cute sketch border */}
          <div className="relative flex-1 md:w-52">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2.2]" />
            <input
              type="text"
              placeholder="Tìm từ vựng, nghĩa tiếng Việt..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full bg-[#fdfbf7] border-2 border-stone-800 rounded-xl pl-8 pr-3 py-1 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex bg-[#f5efe6] p-0.5 rounded-xl border-2 border-stone-800">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'card' ? 'bg-amber-200 text-stone-900 border border-stone-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Chế độ lật thẻ 3D"
            >
              <CreditCard className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-200 text-stone-900 border border-stone-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Danh mục tổng hợp"
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Strip - Sketchbook Ruler Style */}
      <div className="bg-[#fffefc] border-2 border-stone-800 p-4 rounded-2xl shadow-[3px_3px_0px_0px_#292524]">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📏</span>
            <span className="font-sketch text-sm text-stone-800 font-bold">Tiến độ chinh phục sổ tay:</span>
          </div>
          <div className="font-sketch text-stone-800 font-bold text-sm bg-yellow-100 border border-stone-800 px-2 py-0.5 rounded-md">
            Đã thuộc {learnedWords.length} / {VOCAB_DATA.length} từ ({progressPercentage}%)
          </div>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border-2 border-stone-800 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 rounded-full transition-all duration-500 border-r border-stone-800"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-16 bg-[#fffefc] rounded-2xl border-2 border-dashed border-stone-400">
          <p className="text-stone-500 font-sketch text-lg">Không tìm thấy từ vựng nào khớp với bộ lọc.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-sketch text-amber-700 underline"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : viewMode === 'card' && currentWord ? (
        /* SINGLE 3D CARD MODE - ARCHITECTURAL SKETCH CARD */
        <div className="flex flex-col items-center">
          {/* Card Top Metadata & Quick Actions */}
          <div className="flex items-center justify-between w-full max-w-xl text-xs text-stone-600 mb-2.5 px-1 font-sketch text-sm">
            <span>
              Thẻ số <strong className="text-stone-900 text-base">{safeIndex + 1}</strong> / {filteredWords.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors px-2 py-0.5 rounded-lg border border-stone-400 bg-white"
                title="Trộn ngẫu nhiên"
              >
                <Shuffle className="w-3 h-3 stroke-[2.2]" /> Trộn thẻ
              </button>
              <button
                onClick={() => onToggleLearned(currentWord.id)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold border-2 border-stone-800 transition-all ${
                  learnedWords.includes(currentWord.id)
                    ? 'bg-emerald-200 text-stone-900 shadow-[1px_1px_0px_0px_#292524]'
                    : 'bg-white text-stone-700 hover:bg-stone-50 shadow-[1px_1px_0px_0px_#292524]'
                }`}
              >
                {learnedWords.includes(currentWord.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Đã thuộc
                  </>
                ) : (
                  '+ Đánh dấu đã thuộc'
                )}
              </button>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="w-full max-w-xl aspect-[4/3] sm:aspect-[16/10] perspective-1000 cursor-pointer select-none"
            onClick={handleFlipCard}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD - SKETCH PAPER */}
              <div className="absolute inset-0 backface-hidden bg-[#fffdf9] border-2 border-stone-850 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[5px_5px_0px_0px_#292524] relative overflow-hidden">
                {/* Washi Tape Decor on Top */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape rounded-sm shadow-sm rotate-[-1deg]" />

                {/* Top Card Info */}
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-sketch bg-stone-100 border border-stone-800 text-stone-800">
                    {getCategoryIcon(currentWord.category)}
                    {currentWord.category}
                  </span>

                  {learnedWords.includes(currentWord.id) && (
                    <span className="text-xs font-sketch font-bold text-emerald-800 bg-emerald-200/90 px-2 py-0.5 rounded-md border border-stone-800 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Thuộc bài
                    </span>
                  )}
                </div>

                {/* Center Word Content with Pencil Sketch Vibe */}
                <div className="text-center my-auto py-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sketch font-bold text-stone-900 tracking-wide drop-shadow-sm">
                    {currentWord.word}
                  </h2>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="text-stone-500 font-mono text-sm bg-stone-100 px-2.5 py-0.5 rounded-md border border-dashed border-stone-300">
                      {currentWord.pronunciation}
                    </span>
                    <span className="text-stone-500 text-xs italic font-sketch">
                      • {currentWord.type}
                    </span>
                  </div>

                  {/* Cute Audio Speaker Button */}
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={(e) => handleSpeak(currentWord, e)}
                      className={`p-3.5 rounded-full border-2 border-stone-800 transition-all ${
                        speakingId === currentWord.id
                          ? 'bg-amber-300 scale-110 shadow-[2px_2px_0px_0px_#292524]'
                          : 'bg-white hover:bg-amber-100 shadow-[3px_3px_0px_0px_#292524]'
                      }`}
                      title="Nghe phát âm chuẩn bản xứ"
                    >
                      <Volume2 className="w-5 h-5 text-stone-800 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Bottom Hint */}
                <div className="flex items-center justify-between text-xs font-sketch text-stone-500 border-t border-dashed border-stone-300 pt-2.5">
                  <span className="flex items-center gap-1 text-stone-600">
                    <RotateCw className="w-3.5 h-3.5 text-amber-600 stroke-[2.2]" />
                    Chạm thẻ để lật xem nghĩa & ví dụ
                  </span>
                  <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    +5 DevCoins khi lật
                  </span>
                </div>
              </div>

              {/* BACK OF CARD - ARCHITECTURAL DRAFT NOTES */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fffdfa] border-2 border-stone-850 rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto shadow-[5px_5px_0px_0px_#292524]">
                <div>
                  {/* Header with Meaning & Highlight */}
                  <div className="flex items-start justify-between border-b border-stone-300 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-sketch font-bold text-stone-900">
                          {currentWord.word}
                        </h3>
                        <button
                          onClick={(e) => handleSpeak(currentWord, e)}
                          className="p-1 rounded text-stone-600 hover:text-stone-900"
                        >
                          <Volume2 className="w-4 h-4 stroke-[2.2]" />
                        </button>
                      </div>

                      {/* Cute Marker Highlight for Vietnamese Meaning */}
                      <p className="mt-1 inline-block bg-yellow-200/90 text-stone-900 font-sketch text-lg sm:text-xl font-bold px-2 py-0.5 rounded-md border border-yellow-300 rotate-[-0.5deg]">
                        {currentWord.meaning}
                      </p>
                    </div>

                    <span className="text-xs font-sketch text-stone-500 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded">
                      {currentWord.type}
                    </span>
                  </div>

                  {/* Definition & Context */}
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div>
                      <h4 className="text-[11px] font-sketch font-bold uppercase tracking-wider text-stone-500">
                        Định nghĩa tiếng Anh
                      </h4>
                      <p className="text-stone-700 leading-relaxed font-sans text-xs sm:text-sm">
                        {currentWord.definition}
                      </p>
                    </div>

                    {/* Developer Context Sticky Note */}
                    <div className="bg-[#fcf9ee] border-2 border-dashed border-stone-400 p-2.5 rounded-xl">
                      <h4 className="text-[11px] font-sketch font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <span>📌</span> Bối cảnh dự án & Marketing CĐT
                      </h4>
                      <p className="text-stone-700 text-xs leading-relaxed mt-0.5">
                        {currentWord.context}
                      </p>
                    </div>

                    {/* Live Pitch Example */}
                    <div>
                      <h4 className="text-[11px] font-sketch font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <span>💬</span> Ví dụ thuyết trình (Pitching)
                      </h4>
                      <p className="text-stone-800 italic font-serif text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-2.5 py-0.5 bg-amber-50/50 rounded-r-lg">
                        "{currentWord.example}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Tip & Master Button */}
                <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-stone-600 flex items-center gap-1 flex-1 pr-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[2.2]" />
                    <span className="truncate italic">
                      <strong>Mẹo:</strong> {currentWord.executiveTip}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLearned(currentWord.id);
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl font-sketch font-bold text-xs border-2 border-stone-800 transition-all ${
                      learnedWords.includes(currentWord.id)
                        ? 'bg-emerald-200 text-stone-900 shadow-[1px_1px_0px_0px_#292524]'
                        : 'bg-amber-300 hover:bg-amber-200 text-stone-900 shadow-[2px_2px_0px_0px_#292524]'
                    }`}
                  >
                    {learnedWords.includes(currentWord.id) ? '✓ Đã thuộc' : '+15 Xu & Đã thuộc'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls - Cute Sketchbook Buttons */}
          <div className="flex items-center justify-between w-full max-w-xl mt-5 gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-800 py-2.5 rounded-2xl font-sketch text-base font-bold shadow-[3px_3px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" /> Thẻ trước
            </button>

            <button
              onClick={handleFlipCard}
              className="px-4 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-stone-900 rounded-2xl border-2 border-stone-800 font-sketch text-base font-bold shadow-[3px_3px_0px_0px_#292524] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <RotateCw className="w-4 h-4 stroke-[2.2]" /> Lật thẻ
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-300 hover:bg-amber-200 text-stone-900 border-2 border-stone-800 py-2.5 rounded-2xl font-sketch text-base font-bold shadow-[3px_3px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Thẻ kế tiếp <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      ) : (
        /* GLOSSARY GRID VIEW - NOTEBOOK INDEX CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((item) => {
            const isLearned = learnedWords.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 border-stone-800 transition-all ${
                  isLearned
                    ? 'bg-[#fffdf9] shadow-[3px_3px_0px_0px_#292524]'
                    : 'bg-[#fffefc] shadow-[3px_3px_0px_0px_#292524]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-sketch font-bold text-stone-900">{item.word}</h3>
                      <button
                        onClick={() => handleSpeak(item)}
                        className="p-1 rounded text-stone-500 hover:text-stone-900"
                        title="Phát âm"
                      >
                        <Volume2 className="w-4 h-4 stroke-[2.2]" />
                      </button>
                    </div>
                    <span className="inline-block bg-yellow-100 text-stone-900 font-sketch text-sm font-bold px-2 py-0.5 rounded border border-stone-300">
                      {item.meaning}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleLearned(item.id)}
                    className={`p-1.5 rounded-xl border-2 border-stone-800 transition-all ${
                      isLearned
                        ? 'bg-emerald-200 text-stone-900 shadow-[1px_1px_0px_0px_#292524]'
                        : 'bg-white text-stone-400 hover:text-stone-800 shadow-[1px_1px_0px_0px_#292524]'
                    }`}
                    title={isLearned ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 mt-2">
                  <p className="line-clamp-2">{item.definition}</p>
                  <p className="italic text-stone-700 border-l-2 border-amber-300 pl-2 bg-amber-50/50 py-0.5 rounded-r">
                    "{item.example}"
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-sketch">
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                  <span className="font-mono text-stone-400">{item.pronunciation}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
