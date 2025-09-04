<?php

namespace App\Filament\Resources\NameCategories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NameCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
            ]);
    }
}
