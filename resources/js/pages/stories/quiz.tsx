'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { useState } from 'react';

// Mock quiz data
const quizzes = {
    1: {
        storyId: 1,
        storyTitle: 'Malin Kundang',
        questions: [
            {
                id: 1,
                question: 'Siapa nama ibu Malin Kundang?',
                options: ['Mande Rubayah', 'Siti Nurbaya', 'Dayang Sumbi', 'Dewi Sartika'],
                correctAnswer: 0,
                explanation: 'Ibu Malin Kundang bernama Mande Rubayah, seorang janda miskin yang tinggal di desa nelayan.',
            },
            {
                id: 2,
                question: 'Mengapa Malin Kundang memutuskan untuk merantau?',
                options: ['Ingin berpetualang', 'Mengubah nasib keluarga', 'Melarikan diri dari hutang', 'Mencari ayahnya'],
                correctAnswer: 1,
                explanation: 'Malin Kundang merantau untuk mengubah nasib keluarganya yang hidup dalam kemiskinan.',
            },
            {
                id: 3,
                question: 'Apa yang terjadi ketika Malin Kundang kembali ke kampung halaman?',
                options: [
                    'Ia menyambut ibunya dengan gembira',
                    'Ia menyangkal bahwa wanita tua itu ibunya',
                    'Ia memberikan harta kepada ibunya',
                    'Ia meminta maaf kepada ibunya',
                ],
                correctAnswer: 1,
                explanation: 'Malin Kundang menyangkal bahwa wanita tua itu adalah ibunya karena merasa malu dengan penampilan ibunya.',
            },
            {
                id: 4,
                question: 'Apa kutukan yang diberikan ibu Malin Kundang?',
                options: ['Menjadi miskin selamanya', 'Menjadi batu', 'Kehilangan istri', 'Kapalnya tenggelam'],
                correctAnswer: 1,
                explanation: 'Ibu Malin Kundang mengutuk anaknya menjadi batu karena sikap durhakanya.',
            },
            {
                id: 5,
                question: 'Di mana lokasi batu Malin Kundang dapat dilihat hingga sekarang?',
                options: ['Pantai Kuta', 'Pantai Air Manis', 'Pantai Parangtritis', 'Pantai Sanur'],
                correctAnswer: 1,
                explanation: 'Batu Malin Kundang dapat dilihat di Pantai Air Manis, Padang, Sumatera Barat.',
            },
        ],
    },
    2: {
        storyId: 2,
        storyTitle: 'Sangkuriang',
        questions: [
            {
                id: 1,
                question: 'Siapa nama ibu Sangkuriang?',
                options: ['Dayang Sumbi', 'Mande Rubayah', 'Dewi Kadita', 'Roro Jonggrang'],
                correctAnswer: 0,
                explanation: 'Ibu Sangkuriang bernama Dayang Sumbi, seorang putri yang memiliki kesaktian awet muda.',
            },
            {
                id: 2,
                question: 'Siapa ayah Sangkuriang yang sebenarnya?',
                options: ['Seorang raja', 'Tumang (anjing kesayangan)', 'Seorang dewa', 'Tidak disebutkan'],
                correctAnswer: 1,
                explanation: 'Ayah Sangkuriang adalah Tumang, seekor anjing yang sebenarnya adalah dewa yang dikutuk.',
            },
            {
                id: 3,
                question: 'Mengapa Sangkuriang meninggalkan rumah?',
                options: ['Ingin merantau', 'Diusir karena membunuh Tumang', 'Mencari pekerjaan', 'Ingin berpetualang'],
                correctAnswer: 1,
                explanation: 'Sangkuriang meninggalkan rumah setelah ibunya marah karena ia membunuh Tumang.',
            },
            {
                id: 4,
                question: 'Apa syarat yang diberikan Dayang Sumbi kepada Sangkuriang?',
                options: ['Membawa emas', 'Membuat danau dan perahu dalam satu malam', 'Mengalahkan raksasa', 'Mencari bunga langka'],
                correctAnswer: 1,
                explanation: 'Dayang Sumbi meminta Sangkuriang membuat danau dan perahu dalam waktu satu malam.',
            },
            {
                id: 5,
                question: 'Apa yang terjadi dengan perahu yang ditendang Sangkuriang?',
                options: ['Hancur berkeping-keping', 'Menjadi Gunung Tangkuban Perahu', 'Tenggelam di danau', 'Terbang ke langit'],
                correctAnswer: 1,
                explanation: 'Perahu yang ditendang Sangkuriang terbalik dan menjadi Gunung Tangkuban Perahu.',
            },
        ],
    },
};

interface PageProps {
    params: {
        id: string;
    };
}

export default function QuizPage({ params }: PageProps) {
    const quiz = quizzes[Number.parseInt(params.id) as keyof typeof quizzes];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizCompleted(true);
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / quiz.questions.length) * 100);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setQuizCompleted(false);
    };

    const score = calculateScore();
    const correctAnswers = quiz.questions.filter((question, index) => selectedAnswers[index] === question.correctAnswer).length;

    if (showResults) {
        return (
            <div className="container max-w-2xl py-8">
                <div className="space-y-6 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                            <Trophy className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold">Kuis Selesai!</h1>
                        <p className="text-muted-foreground">Berikut adalah hasil kuis kamu untuk cerita "{quiz.storyTitle}"</p>
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
                                        {correctAnswers}/{quiz.questions.length}
                                    </span>
                                </div>
                                <Progress value={(correctAnswers / quiz.questions.length) * 100} />
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
                        <div className="space-y-3">
                            {quiz.questions.map((question, index) => {
                                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                                return (
                                    <Card key={question.id} className={`${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                {isCorrect ? (
                                                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
                                                )}
                                                <div className="flex-1 space-y-2">
                                                    <p className="font-medium">{question.question}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        <strong>Jawaban yang benar:</strong> {question.options[question.correctAnswer]}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
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
                            <Link href={`/cerita/${quiz.storyId}`}>Kembali ke Cerita</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/cerita">Cerita Lainnya</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="container max-w-2xl py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href={`/cerita/${quiz.storyId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Cerita
                    </Link>
                </Button>
                <Badge variant="outline">
                    Soal {currentQuestion + 1} dari {quiz.questions.length}
                </Badge>
            </div>

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
                    <CardTitle className="text-xl">Kuis: {quiz.storyTitle}</CardTitle>
                    <CardDescription>Pilih jawaban yang paling tepat</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-medium">{question.question}</h3>

                        <RadioGroup
                            value={selectedAnswers[currentQuestion]?.toString()}
                            onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                        >
                            {question.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-accent/50">
                                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                            Sebelumnya
                        </Button>

                        <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
                            {currentQuestion === quiz.questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Question Navigation */}
            <div className="mt-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {quiz.questions.map((_, index) => (
                        <Button
                            key={index}
                            variant={currentQuestion === index ? 'default' : selectedAnswers[index] !== undefined ? 'secondary' : 'outline'}
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
    );
}
