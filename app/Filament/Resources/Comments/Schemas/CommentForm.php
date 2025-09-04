<?php

namespace App\Filament\Resources\Comments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('content')
                    ->required()
                    ->columnSpanFull(),
                Select::make('story_id')
                    ->searchable()
                    ->preload()
                    ->relationship('story', 'title')
                    ->required(),
                Select::make('user_id')
                    ->searchable()
                    ->preload()
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('parent_id')
                    ->searchable()
                    ->preload()
                    ->relationship('parent', 'content'),
                Toggle::make('is_approved')
                    ->required(),
            ]);
    }
}
