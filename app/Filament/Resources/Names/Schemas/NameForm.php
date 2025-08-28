<?php

namespace App\Filament\Resources\Names\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NameForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('meaning')
                    ->required(),
                TextInput::make('origin')
                    ->required(),
            ]);
    }
}
