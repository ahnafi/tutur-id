<?php

namespace App\Filament\Resources\QuizResults\Schemas;

use Dom\Text;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class QuizResultForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->searchable(['name', 'email'])
                    ->preload()
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('story_id')
                    ->searchable()
                    ->preload()
                    ->relationship('story', 'title')
                    ->required(),
                TextInput::make('score')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->default(0),
            ]);
    }
}
