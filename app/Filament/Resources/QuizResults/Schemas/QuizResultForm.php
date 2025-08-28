<?php

namespace App\Filament\Resources\QuizResults\Schemas;

use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class QuizResultForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('story_id')
                    ->relationship('story', 'title')
                    ->required(),
            ]);
    }
}
