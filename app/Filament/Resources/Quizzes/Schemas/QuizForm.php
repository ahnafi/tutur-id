<?php

namespace App\Filament\Resources\Quizzes\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Schema;

class QuizForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('story_id')
                    ->relationship('story', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('question')
                    ->required(),
                TextInput::make('option_a')
                    ->required(),
                TextInput::make('option_b')
                    ->required(),
                TextInput::make('option_c')
                    ->required(),
                TextInput::make('option_d')
                    ->required(),
                ToggleButtons::make('correct_answer')
                    ->inline()
                    ->required()
                    ->options([
                        'A' => 'A',
                        'B' => 'B',
                        'C' => 'C',
                        'D' => 'D',
                    ])
            ]);
    }
}
