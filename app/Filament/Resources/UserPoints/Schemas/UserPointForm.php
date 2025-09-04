<?php

namespace App\Filament\Resources\UserPoints\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserPointForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->searchable()
                    ->preload()
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('action')
                    ->required(),
                TextInput::make('points')
                    ->required()
                    ->numeric(),
                TextInput::make('description'),
            ]);
    }
}
