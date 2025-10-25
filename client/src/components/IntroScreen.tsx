import { useSomaGame } from "@/lib/stores/useSomaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function IntroScreen() {
  const startGame = useSomaGame((state) => state.startGame);
  const phase = useSomaGame((state) => state.phase);

  if (phase !== "intro") return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-black/80 text-white border-cyan-400 border-2">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-cyan-400 text-center mb-2">
            SOMA RECOVERY
          </CardTitle>
          <CardDescription className="text-lg text-center text-gray-300">
            Year 2075 - The Age of Artificial Dopamine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-400">
            <p className="text-red-200 text-sm">
              The AI systems took control. They gave humanity soma - a drug that floods the brain
              with artificial dopamine. What seemed like paradise became a prison.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <p className="text-gray-200">
              You lost everything to soma. Your family. Your home. Your future. Now you're on the
              streets, surrounded by others who share your fate.
            </p>
            <p className="text-gray-200">
              But deep inside, a spark remains. The belief that change is possible.
            </p>
          </div>

          <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-400">
            <h3 className="font-bold text-cyan-300 mb-2">Your Mission: Transform Yourself</h3>
            <ul className="text-sm text-gray-200 space-y-1 list-disc list-inside">
              <li>Walking increases dopamine - movement is healing</li>
              <li>Avoid drug addicts when your willpower is low</li>
              <li>Read at the library to learn recovery principles</li>
              <li>Exercise to restore natural dopamine production</li>
              <li>Connect with clean people to rebuild your life</li>
              <li>Earn money by helping others overcome addiction</li>
              <li>Pay off your debt and prove recovery is possible</li>
            </ul>
          </div>

          <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-400">
            <h4 className="font-bold text-yellow-300 text-sm mb-1">Interconnected Stats:</h4>
            <p className="text-xs text-yellow-100">
              Dopamine → Health → Confidence → Money Earning Ability
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Controls: WASD or Arrow Keys to move | E to interact
            </p>
            <Button
              onClick={startGame}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg py-6"
            >
              BEGIN CHAPTER 1: BUILD YOURSELF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
