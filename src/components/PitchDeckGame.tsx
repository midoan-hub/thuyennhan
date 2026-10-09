import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Coins, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Lightbulb, 
  UserCheck,
  Award,
  Check,
  X
} from 'lucide-react';
import { PITCH_DECK_QUESTIONS, QuizQuestion } from '../data/vocabData';

interface PitchDeckGameProps {
  onAwardCoins: (amount: number, reason: string) => void;
  onUpdateHighScore: (score: number) => void;
  currentHighScore: number;
}

export const PitchDeckGame: React.FC<PitchDeckGameProps> = ({
  onAwardCoins,
  onUpdateHighScore,
  currentHighScore
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streakCombo, setStreakCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<
    { questionId: string; selected: number; correct: boolean }[]
  >([]);

  const currentQuestion: QuizQuestion = PITCH_DECK_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    const newAnswers = [...userAnswersHistory, { questionId: currentQuestion.id, selected: idx, correct: isCorrect }];
    setUserAnswersHistory(newAnswers);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      const newStreak = streakCombo + 1;
      setStreakCombo(newStreak);

      const coinReward = 20 + (newStreak > 1 ? newStreak * 5 : 0);
      onAwardCoins(coinReward, `Thuyết trình thành công (+${coinReward})`);
    } else {
      setStreakCombo(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < PITCH_DECK_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsGameOver(true);
    const finalScore = score + (selectedAnswer === currentQuestion.correctIndex ? 0 : 0);
    if (finalScore > currentHighScore) {
      onUpdateHighScore(finalScore);
    }

    if (finalScore >= 8) {
      try {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#3b82f6', '#10b981', '#fbbf24']
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }
    }

    const completionBonus = finalScore === PITCH_DECK_QUESTIONS.length ? 100 : finalScore * 10;
    onAwardCoins(completionBonus, 'Hoàn thành buổi thuyết trình Pitch Deck');
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreakCombo(0);
    setIsGameOver(false);
    setUserAnswersHistory([]);
  };

  const renderPromptSentence = () => {
    const parts = currentQuestion.sentencePrompt.split('[_____]');
    return (
      <span>
        {parts[0]}
        <span
          className={`inline-block font-sketch text-lg border-b-2 px-2.5 py-0.5 mx-1 transition-all rounded ${
            isAnswered
              ? selectedAnswer === currentQuestion.correctIndex
                ? 'border-emerald-600 text-emerald-800 bg-emerald-100 font-bold'
                : 'border-rose-600 text-rose-800 bg-rose-100 font-bold'
              : 'border-amber-600 text-amber-800 bg-amber-100/70 border-dashed font-bold'
          }`}
        >
          {isAnswered && selectedAnswer !== null
            ? currentQuestion.options[selectedAnswer]
            : ' [ ? Chọn từ vựng ] '}
        </span>
        {parts[1]}
      </span>
    );
  };

  if (isGameOver) {
    const percentage = Math.round((score / PITCH_DECK_QUESTIONS.length) * 100);
    let rankTitle = 'Chuyên viên Marketing Sơ cấp';
    let badgeEmoji = '📋';

    if (percentage === 100) {
      rankTitle = 'Cổ đông Phát triển & Bậc thầy Thuyết trình';
      badgeEmoji = '👑';
    } else if (percentage >= 80) {
      rankTitle = 'Giám đốc Phát triển Dự án (CDO)';
      badgeEmoji = '🏆';
    } else if (percentage >= 60) {
      rankTitle = 'Trưởng ban Chiến lược Bán hàng';
      badgeEmoji = '🥈';
    }

    return (
      <div className="w-full max-w-xl mx-auto space-y-6">
        <div className="bg-[#fffdf9] border-2 border-stone-850 rounded-3xl p-7 text-center shadow-[6px_6px_0px_0px_#292524] relative overflow-hidden">
          {/* Top Washi Tape */}
          <div className="w-32 h-5 washi-tape mx-auto rounded-sm mb-4 rotate-[-1deg]" />

          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-100 border-2 border-stone-800 shadow-[3px_3px_0px_0px_#292524] flex items-center justify-center text-4xl">
              {badgeEmoji}
            </div>

            <div>
              <span className="text-xs font-sketch uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-300">
                Báo cáo kết quả Hội đồng Đầu tư
              </span>
              <h2 className="text-3xl font-sketch font-bold text-stone-900 mt-2">
                Tổng kết Pitch Deck
              </h2>
              <p className="text-xl font-sketch font-bold text-amber-700 mt-0.5">
                {rankTitle}
              </p>
            </div>

            {/* Score Grid in Notebook Style */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="bg-[#fcfbf7] p-3 rounded-2xl border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]">
                <span className="text-[11px] font-sketch text-stone-500 block mb-0.5">Điểm số</span>
                <span className="text-2xl font-sketch font-bold text-stone-900">
                  {score}/{PITCH_DECK_QUESTIONS.length}
                </span>
              </div>
              <div className="bg-[#fcfbf7] p-3 rounded-2xl border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]">
                <span className="text-[11px] font-sketch text-stone-500 block mb-0.5">Độ chính xác</span>
                <span className="text-2xl font-sketch font-bold text-amber-600">
                  {percentage}%
                </span>
              </div>
              <div className="bg-[#fcfbf7] p-3 rounded-2xl border-2 border-stone-800 shadow-[2px_2px_0px_0px_#292524]">
                <span className="text-[11px] font-sketch text-stone-500 block mb-0.5">Thưởng xu</span>
                <span className="text-2xl font-sketch font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Coins className="w-5 h-5 text-amber-500 fill-amber-300 stroke-[2.2]" /> +{score * 20 + (percentage === 100 ? 100 : 20)}
                </span>
              </div>
            </div>

            {percentage === 100 && (
              <div className="bg-yellow-100 border-2 border-stone-800 p-3 rounded-xl text-xs font-sketch text-stone-800 flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#292524]">
                <Award className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.2]" />
                <span>
                  <strong>Thuyết trình hoàn hảo 10/10!</strong> Bạn đã mở khóa huy hiệu "Pitch Perfect".
                </span>
              </div>
            )}

            <button
              onClick={handleRestart}
              className="w-full bg-amber-300 hover:bg-amber-200 text-stone-900 font-sketch text-lg font-bold py-3 rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" /> Thử sức buổi thuyết trình mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Status Bar in Sketchbook Style */}
      <div className="flex items-center justify-between bg-[#fffefc] px-4 py-2.5 rounded-2xl border-2 border-stone-800 shadow-[3px_3px_0px_0px_#292524] text-xs font-sketch">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-700 stroke-[2.2]" />
          <span className="text-stone-700 text-sm">
            Slide thuyết trình: <strong className="text-stone-900 text-base">{currentIdx + 1}</strong> / {PITCH_DECK_QUESTIONS.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {streakCombo > 1 && (
            <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-100 border border-stone-800 px-2 py-0.5 rounded-md text-sm">
              <Flame className="w-3.5 h-3.5 fill-orange-500 stroke-[2.2]" />
              <span>{streakCombo}x Liên hoàn!</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-stone-700 bg-yellow-100 border border-stone-800 px-2.5 py-0.5 rounded-md text-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-600 stroke-[2.2]" />
            <strong className="text-stone-900">{score}</strong> điểm
          </div>
        </div>
      </div>

      {/* Progress Bar Ruler */}
      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border-2 border-stone-800 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / PITCH_DECK_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Slide Canvas Card - Architect's Presentation Board */}
      <div className="bg-[#fffdf9] border-2 border-stone-850 rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#292524] relative overflow-hidden">
        {/* Slide Header Sticky Notes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-dashed border-stone-300 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-sketch text-xs px-2.5 py-1 rounded-md bg-yellow-100 text-stone-800 font-bold border border-stone-800 rotate-[-1deg]">
              {currentQuestion.deckSlide}
            </span>
            <span className="text-xs font-sketch text-stone-600 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-stone-500 stroke-[2.2]" />
              Vai trò: {currentQuestion.role}
            </span>
          </div>

          <span className="text-xs font-sketch text-stone-500 italic">
            Bối cảnh: {currentQuestion.scenario}
          </span>
        </div>

        {/* Pitch Statement Script */}
        <div className="my-5">
          <h3 className="text-xs font-sketch font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
            <span>🎤</span> Lời thuyết minh trình bày trước Hội đồng:
          </h3>
          <div className="p-4 rounded-2xl bg-[#faf7f2] border-2 border-stone-800 text-stone-800 text-base sm:text-lg leading-relaxed font-sans shadow-inner">
            "{renderPromptSentence()}"
          </div>
        </div>

        {/* Multiple Choice Options - Hand-Drawn Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
          {currentQuestion.options.map((opt, idx) => {
            let optionStyles = 'bg-white border-2 border-stone-800 text-stone-800 hover:bg-amber-50 shadow-[2px_2px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5';

            if (isAnswered) {
              if (idx === currentQuestion.correctIndex) {
                optionStyles = 'bg-emerald-100 border-2 border-emerald-800 text-emerald-950 font-bold shadow-[2px_2px_0px_0px_#059669]';
              } else if (idx === selectedAnswer) {
                optionStyles = 'bg-rose-100 border-2 border-rose-800 text-rose-950 shadow-[2px_2px_0px_0px_#e11d48]';
              } else {
                optionStyles = 'bg-stone-50 border-2 border-stone-300 text-stone-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl font-sketch text-base font-bold transition-all flex items-center justify-between ${optionStyles}`}
              >
                <span className="flex-1 pr-2">{opt}</span>
                {isAnswered && idx === currentQuestion.correctIndex && (
                  <Check className="w-5 h-5 text-emerald-700 stroke-[3] shrink-0" />
                )}
                {isAnswered && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                  <X className="w-5 h-5 text-rose-700 stroke-[3] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Executive Insights */}
        {isAnswered && (
          <div className="mt-5 pt-4 border-t-2 border-dashed border-stone-300 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className={`p-3.5 rounded-2xl border-2 border-stone-800 text-xs sm:text-sm font-sans ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-emerald-50 text-emerald-950'
                : 'bg-stone-50 text-stone-800'
            }`}>
              <div className="font-sketch font-bold text-base flex items-center gap-1.5 mb-1 text-stone-900">
                <Sparkles className="w-4 h-4 text-amber-600 stroke-[2.2]" />
                <span>Giải thích từ vựng:</span>
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-100 border-2 border-stone-800 text-xs text-stone-800 flex items-start gap-2 shadow-[2px_2px_0px_0px_#292524]">
              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 stroke-[2.2]" />
              <div className="font-sans">
                <strong className="font-sketch text-sm text-stone-900 block">Mẹo chiến lược Marketing:</strong>
                {currentQuestion.executiveInsight}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full bg-amber-300 hover:bg-amber-200 text-stone-900 font-sketch text-lg font-bold py-3 rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_#292524] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 mt-3"
            >
              {currentIdx < PITCH_DECK_QUESTIONS.length - 1 ? (
                <>Slide tiếp theo <ChevronRight className="w-4 h-4 stroke-[2.2]" /></>
              ) : (
                <>Hoàn tất buổi thuyết trình <Trophy className="w-4 h-4 stroke-[2.2]" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
