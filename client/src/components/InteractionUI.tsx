import { useState } from "react";
import { useSomaGame } from "@/lib/stores/useSomaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BOOKS = [
  {
    id: "growth-mindset",
    title: "Growth Mindset",
    description: "The belief that you can change and improve",
    content: "You are not fixed. Your brain can rewire. Recovery is possible. Every small step forward proves you can change. This is the foundation of all transformation.",
    quiz: {
      question: "What is the key message of growth mindset?",
      options: [
        "I am doomed to fail",
        "I can change and improve through effort",
        "Only some people can recover",
      ],
      correct: 1,
    }
  },
  {
    id: "how-addiction-works",
    title: "Understanding Soma",
    description: "How the drug hijacks your brain",
    content: "Soma floods your brain with artificial dopamine. Over time, your brain stops producing its own. That's why you feel empty without it. But your brain can heal. Exercise, reading, and connection naturally restore dopamine.",
    quiz: {
      question: "How do you restore natural dopamine?",
      options: [
        "Only through more soma",
        "Exercise, reading, and human connection",
        "It's impossible to restore",
      ],
      correct: 1,
    }
  },
  {
    id: "habit-formation",
    title: "Building New Habits",
    description: "Replace bad patterns with good ones",
    content: "Habits are formed through repetition. Avoid triggers (people and places that tempt you). Replace the bad habit with a good one. Stay consistent. Small wins compound into transformation.",
    quiz: {
      question: "How do you break bad habits?",
      options: [
        "Willpower alone is enough",
        "Avoid triggers and replace with good habits",
        "Wait for motivation to strike",
      ],
      correct: 1,
    }
  },
];

export function InteractionUI() {
  const interaction = useSomaGame((state) => state.interaction);
  const endInteraction = useSomaGame((state) => state.endInteraction);
  const readBook = useSomaGame((state) => state.readBook);
  const completeExercise = useSomaGame((state) => state.completeExercise);
  const completeConversation = useSomaGame((state) => state.completeConversation);
  const resistTemptation = useSomaGame((state) => state.resistTemptation);
  const booksRead = useSomaGame((state) => state.booksRead);
  const stats = useSomaGame((state) => state.stats);
  
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS[0] | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  if (!interaction.isActive) return null;

  const handleBookSelect = (book: typeof BOOKS[0]) => {
    if (stats.dopamine < 10) {
      alert("Your dopamine is too low to focus on reading. Try walking or exercising first.");
      return;
    }
    setSelectedBook(book);
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !selectedBook) return;
    
    const isCorrect = quizAnswer === selectedBook.quiz.correct;
    setShowQuizResult(true);
    
    if (isCorrect) {
      readBook(selectedBook.id);
      setTimeout(() => {
        setSelectedBook(null);
        setShowQuizResult(false);
      }, 2000);
    }
  };

  const handleExercise = () => {
    completeExercise();
    setTimeout(() => endInteraction(), 1500);
  };

  const handleConversation = () => {
    if (interaction.target && 'type' in interaction.target) {
      completeConversation(interaction.target.id);
      setTimeout(() => endInteraction(), 2000);
    }
  };

  const handleResist = () => {
    const canResist = stats.dopamine >= 30;
    resistTemptation(canResist);
    setTimeout(() => endInteraction(), 2000);
  };

  // Library interaction
  if (interaction.type === "library") {
    return (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center p-4">
        {!selectedBook ? (
          <Card className="max-w-2xl w-full bg-purple-900 text-white border-purple-400">
            <CardHeader>
              <CardTitle className="text-2xl">Library - Story Discs</CardTitle>
              <CardDescription className="text-purple-200">
                Experience the lessons through interactive stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {BOOKS.map((book) => (
                  <div
                    key={book.id}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      booksRead.includes(book.id)
                        ? "bg-green-900 border-green-400 opacity-60"
                        : "bg-purple-800 border-purple-300 hover:bg-purple-700"
                    }`}
                    onClick={() => !booksRead.includes(book.id) && handleBookSelect(book)}
                  >
                    <h3 className="font-bold text-lg">
                      {book.title} {booksRead.includes(book.id) && "✓"}
                    </h3>
                    <p className="text-sm text-purple-200">{book.description}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={endInteraction}
                className="mt-4 w-full bg-white text-purple-900 hover:bg-purple-100"
              >
                Leave Library
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl w-full bg-purple-900 text-white border-purple-400">
            <CardHeader>
              <CardTitle>{selectedBook.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-purple-800 rounded-lg">
                <p className="text-purple-100">{selectedBook.content}</p>
              </div>
              
              {!showQuizResult ? (
                <>
                  <p className="font-semibold mb-2">{selectedBook.quiz.question}</p>
                  <div className="space-y-2 mb-4">
                    {selectedBook.quiz.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded cursor-pointer ${
                          quizAnswer === index
                            ? "bg-purple-700 border-white"
                            : "bg-purple-800 border-purple-300 hover:bg-purple-700"
                        }`}
                        onClick={() => setQuizAnswer(index)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={quizAnswer === null}
                    className="w-full bg-white text-purple-900 hover:bg-purple-100"
                  >
                    Submit Answer
                  </Button>
                </>
              ) : (
                <div className={`p-4 rounded-lg ${
                  quizAnswer === selectedBook.quiz.correct
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}>
                  {quizAnswer === selectedBook.quiz.correct
                    ? "✓ Correct! Lesson learned. Dopamine +15"
                    : "✗ Incorrect. Read carefully and try again."}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Exercise interaction
  if (interaction.type === "exercise") {
    return (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-orange-900 text-white border-orange-400">
          <CardHeader>
            <CardTitle className="text-2xl">Exercise</CardTitle>
            <CardDescription className="text-orange-200">
              Physical activity restores dopamine and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-orange-100">
              Push-ups, squats, and movement restore your brain's natural dopamine production.
              Exercise is medicine.
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleExercise}
                className="w-full bg-white text-orange-900 hover:bg-orange-100"
              >
                Complete Workout (+10 Dopamine, +5 Health)
              </Button>
              <Button
                onClick={endInteraction}
                variant="outline"
                className="w-full bg-transparent border-white text-white hover:bg-orange-800"
              >
                Leave Gym
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conversation interaction
  if (interaction.type === "conversation") {
    const npc = interaction.target as any;
    return (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-green-900 text-white border-green-400">
          <CardHeader>
            <CardTitle className="text-2xl">Clean Connection</CardTitle>
            <CardDescription className="text-green-200">
              Connecting with people in recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-green-100 italic">
              "{npc?.message || 'Stay strong. You can do this.'}"
            </p>
            <p className="mb-4 text-sm text-green-200">
              Talking with people who understand your struggle helps. By helping them, you help yourself and earn their support.
            </p>
            {stats.dopamine >= 20 ? (
              <div className="space-y-2">
                <Button
                  onClick={handleConversation}
                  className="w-full bg-white text-green-900 hover:bg-green-100"
                >
                  Have Conversation (+8 Dopamine, +$50)
                </Button>
                <Button
                  onClick={endInteraction}
                  variant="outline"
                  className="w-full bg-transparent border-white text-white hover:bg-green-800"
                >
                  Leave
                </Button>
              </div>
            ) : (
              <div className="bg-red-900 p-3 rounded-lg mb-2">
                <p className="text-sm">Your dopamine is too low to maintain focus in conversation. Exercise or read first.</p>
                <Button
                  onClick={endInteraction}
                  className="w-full mt-2 bg-white text-red-900"
                >
                  Leave
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Temptation interaction
  if (interaction.type === "temptation") {
    return (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-red-900 text-white border-red-400 animate-pulse">
          <CardHeader>
            <CardTitle className="text-2xl">⚠️ TEMPTATION</CardTitle>
            <CardDescription className="text-red-200">
              Soma addict nearby - resist or relapse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-red-100">
              A soma user is offering you the drug. Your dopamine is {Math.round(stats.dopamine)}/100.
            </p>
            {stats.dopamine >= 30 ? (
              <p className="mb-4 text-green-300 font-semibold">
                Your willpower is strong enough to resist!
              </p>
            ) : (
              <p className="mb-4 text-red-300 font-semibold">
                Your willpower is weak. This will be hard...
              </p>
            )}
            <div className="space-y-2">
              <Button
                onClick={handleResist}
                className={`w-full ${
                  stats.dopamine >= 30
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                {stats.dopamine >= 30 ? "Resist Successfully" : "Try to Resist (Will Fail)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
