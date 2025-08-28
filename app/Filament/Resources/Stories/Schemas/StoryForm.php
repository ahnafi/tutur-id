<?php

namespace App\Filament\Resources\Stories\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class StoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('content')
                    ->columnSpanFull(),
                TextInput::make('origin_place'),
                TextInput::make('gmaps_link'),
                Toggle::make('is_official')
                    ->required(),
                TextInput::make('created_by')
                    ->required()
                    ->numeric(),
                Select::make('story_category_id')
                    ->relationship('storyCategory', 'title')
                    ->required(),
            ]);
    }
}
