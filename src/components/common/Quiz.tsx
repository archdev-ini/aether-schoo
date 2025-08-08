
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = {
  question: "Which of these is a key principle of climate-responsive design?",
  options: [
    "Using imported, high-tech materials",
    "Maximizing solar gain in all climates",
    "Ignoring local wind patterns",
    "Considering sun orientation and natural ventilation",
  ],
  correctAnswer: "Considering sun orientation and natural ventilation",
};

export function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }

  const isCorrect = selectedAnswer === quizData.correctAnswer;

  if (isSubmitted) {
    return (
        <Card className={`p-6 ${isCorrect ? 'border-green-500' : 'border-destructive'}`}>
            <CardContent className="p-0 text-center space-y-4">
                 {isCorrect ? (
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                 ) : (
                    <XCircle className="w-12 h-12 mx-auto text-destructive" />
                 )}
                 <h3 className="text-xl font-bold">{isCorrect ? 'Correct!' : 'Not Quite'}</h3>
                 <p className="text-muted-foreground">
                    {isCorrect 
                        ? "Great job! Understanding the local climate is the first step to sustainable building."
                        : `The correct answer is: "${quizData.correctAnswer}". This is crucial for creating energy-efficient and comfortable spaces.`
                    }
                 </p>
                 <Button onClick={handleReset} variant="outline" className="w-full">Try Again</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="font-medium">{quizData.question}</p>
      <RadioGroup onValueChange={handleAnswerChange} value={selectedAnswer || ''} className="space-y-3">
        {quizData.options.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button type="submit" disabled={!selectedAnswer} className="w-full">
        Submit Answer
      </Button>
    </form>
  );
}
