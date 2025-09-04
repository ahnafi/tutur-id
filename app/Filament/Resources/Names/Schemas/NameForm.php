<?php

namespace App\Filament\Resources\Names\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class NameForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
//                        "name",
//        "meaning",
//        "origin",
//        "description",
//        "views",
//        "name_category_id"
                TextInput::make('name')
                    ->required(),
                TextInput::make('meaning')
                    ->required(),
                TextInput::make('origin')
                    ->required(),
                Select::make('name_category')
                    ->searchable()
                    ->createOptionForm([
                        TextInput::make('name')
                            ->required(),
                    ])
                    ->relationship('category', 'name')
                    ->preload()
                    ->required(),
                TextInput::make('views')
                    ->numeric()
                    ->visibleOn('edit'),
                Textarea::make('description')
                    ->columnSpanFull(),
            ]);
    }
}
