'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Layout from '@/layouts/layout';
import { Quiz, QuizResult, Story } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, CheckCircle, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizPageProps {
    story: Story;
    previousResult?: QuizResult;
}

export default function QuizPage({ story, previousResult }: QuizPageProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<{
        score: number;
        correctCount: number;
        totalQuestions: number;
        answers: string[];
    } | null>(null);

    const quizzes = story.quizzes || [];

    const handleAnswerSelect = (answerValue: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerValue;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/cerita/${story.slug}/kuis`, {
                answers: selectedAnswers,
            });

            if (response.data.success) {
                setResults(response.data);
                setQuizCompleted(true);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Terjadi kesalahan saat mengirim jawaban');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setQuizCompleted(false);
        setResults(null);
    };

    const getOptionText = (quiz: Quiz, optionKey: string) => {
        switch (optionKey) {
            case 'option_a':
                return quiz.option_a;
            case 'option_b':
                return quiz.option_b;
            case 'option_c':
                return quiz.option_c;
            case 'option_d':
                return quiz.option_d;
            default:
                return '';
        }
    };

    const getOptionLetter = (optionKey: string) => {
        switch (optionKey) {
            case 'option_a':
                return 'A';
            case 'option_b':
                return 'B';
            case 'option_c':
                return 'C';
            case 'option_d':
                return 'D';
            default:
                return '';
        }
    };

    if (showResults && results) {
        const { score, correctCount, totalQuestions } = results;

        return (
            <Layout>
                <Head title={`Hasil Kuis ${story.title} - Cerita Rakyat Nusantara`} />
                <div className="container max-w-2xl py-8">
                    <div className="space-y-6 text-center">
                        <div className="space-y-4">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                                <Trophy className="h-10 w-10 text-primary-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold">Kuis Selesai!</h1>
                            <p className="text-muted-foreground">Berikut adalah hasil kuis kamu untuk cerita "{story.title}"</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Skor Kamu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-primary">{score}</div>
                                    <p className="text-muted-foreground">dari 100 poin</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Jawaban Benar</span>
                                        <span>
                                            {correctCount}/{totalQuestions}
                                        </span>
                                    </div>
                                    <Progress value={(correctCount / totalQuestions) * 100} />
                                </div>

                                <div className="text-center">
                                    {score >= 80 ? (
                                        <Badge className="bg-green-500">Excellent! 🎉</Badge>
                                    ) : score >= 60 ? (
                                        <Badge className="bg-yellow-500">Good Job! 👍</Badge>
                                    ) : (
                                        <Badge variant="secondary">Keep Learning! 📚</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Review Jawaban</h3>
                            <div className="space-y-3 text-left">
                                {quizzes.map((quiz, index) => {
                                    const userAnswer = selectedAnswers[index];
                                    const isCorrect = userAnswer === quiz.correct_answer;

                                    return (
                                        <Card key={quiz.id} className={`${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {isCorrect ? (
                                                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
                                                    )}
                                                    <div className="flex-1 space-y-2">
                                                        <p className="font-medium">{quiz.question}</p>

                                                        {!isCorrect && userAnswer && (
                                                            <p className="text-sm text-red-600">
                                                                <strong>Jawaban kamu:</strong> {getOptionLetter(userAnswer)}.{' '}
                                                                {getOptionText(quiz, userAnswer)}
                                                            </p>
                                                        )}

                                                        <p className="text-sm text-green-600">
                                                            <strong>Jawaban yang benar:</strong> {getOptionLetter(quiz.correct_answer)}.{' '}
                                                            {getOptionText(quiz, quiz.correct_answer)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={resetQuiz} variant="outline">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Ulangi Kuis
                            </Button>
                            <Button asChild>
                                <Link href={`/cerita/${story.slug}`}>Kembali ke Cerita</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/cerita">Cerita Lainnya</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (quizzes.length === 0) {
        return (
            <Layout>
                <Head title={`Kuis ${story.title} - Cerita Rakyat Nusantara`} />
                <div className="container max-w-2xl py-8">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h1 className="mb-4 text-2xl font-bold">Kuis Tidak Tersedia</h1>
                            <p className="mb-6 text-muted-foreground">Maaf, cerita "{story.title}" belum memiliki kuis.</p>
                            <Button asChild>
                                <Link href={`/cerita/${story.slug}`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Cerita
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        );
    }

    const currentQuiz = quizzes[currentQuestion];
    const progress = ((currentQuestion + 1) / quizzes.length) * 100;

    return (
        <Layout>
            <Head title={`Kuis ${story.title} - Cerita Rakyat Nusantara`} />
            <div className="container max-w-2xl py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={`/cerita/${story.slug}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Cerita
                        </Link>
                    </Button>
                    <Badge variant="outline">
                        Soal {currentQuestion + 1} dari {quizzes.length}
                    </Badge>
                </div>

                {/* Previous Result Notification */}
                {previousResult && (
                    <Card className="mb-6 border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <p className="text-sm text-blue-700">
                                <strong>Skor terakhir kamu:</strong> {previousResult.score}/100
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Progress */}
                <div className="mb-8 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress Kuis</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                </div>

                {/* Question Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Kuis: {story.title}</CardTitle>
                        <CardDescription>Pilih jawaban yang paling tepat</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-medium">{currentQuiz.question}</h3>

                            <RadioGroup value={selectedAnswers[currentQuestion] || ''} onValueChange={handleAnswerSelect}>
                                {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey) => (
                                    <div
                                        key={optionKey}
                                        className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                                    >
                                        <RadioGroupItem value={optionKey} id={optionKey} />
                                        <Label htmlFor={optionKey} className="flex-1 cursor-pointer">
                                            <span className="font-medium">{getOptionLetter(optionKey)}.</span> {getOptionText(currentQuiz, optionKey)}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                                Sebelumnya
                            </Button>

                            <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion] || isSubmitting}>
                                {isSubmitting ? 'Memproses...' : currentQuestion === quizzes.length - 1 ? 'Selesai' : 'Selanjutnya'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Navigation */}
                <div className="mt-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {quizzes.map((_, index) => (
                            <Button
                                key={index}
                                variant={currentQuestion === index ? 'default' : selectedAnswers[index] ? 'secondary' : 'outline'}
                                size="sm"
                                className="h-10 w-10"
                                onClick={() => setCurrentQuestion(index)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
