import { useSomaGame } from "@/lib/stores/useSomaGame";
import { Progress } from "@/components/ui/progress";

export function StatsUI() {
  const stats = useSomaGame((state) => state.stats);
  const phase = useSomaGame((state) => state.phase);
  const booksRead = useSomaGame((state) => state.booksRead);
  
  if (phase === "intro") return null;

  return (
    <div className="fixed top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg border-2 border-white/30 min-w-[300px]">
      <h2 className="text-xl font-bold mb-3 text-cyan-400">CHAPTER 1: BUILD YOURSELF</h2>
      
      <div className="space-y-3">
        {/* Dopamine */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold text-purple-400">Dopamine (Willpower)</span>
            <span className="text-sm">{Math.round(stats.dopamine)}/100</span>
          </div>
          <Progress value={stats.dopamine} className="h-3 bg-gray-700" />
          {stats.dopamine < 30 && (
            <p className="text-xs text-red-400 mt-1">⚠️ Low willpower - avoid addicts!</p>
          )}
        </div>

        {/* Health */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold text-green-400">Health</span>
            <span className="text-sm">{Math.round(stats.health)}/100</span>
          </div>
          <Progress value={stats.health} className="h-3 bg-gray-700" />
        </div>

        {/* Confidence */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold text-blue-400">Confidence</span>
            <span className="text-sm">{Math.round(stats.confidence)}/100</span>
          </div>
          <Progress value={stats.confidence} className="h-3 bg-gray-700" />
        </div>

        {/* Money */}
        <div className="pt-2 border-t border-white/20">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-yellow-400">Money</span>
            <span className="text-sm font-mono">${stats.money}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-red-300">Debt</span>
            <span className="text-xs font-mono text-red-300">${stats.debt}</span>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="pt-2 border-t border-white/20 text-xs text-gray-300">
          <div>📚 Books Read: {booksRead.length}/3</div>
        </div>
      </div>
    </div>
  );
}
