<?php

namespace App\Filament\Resources\StoryCategories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class StoryCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
            ]);
    }
}
