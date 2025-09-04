<?php

namespace App\Filament\Resources\UserBadges\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class UserBadgeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->preload()
                    ->required()
                    ->searchable()
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('badge_type')
                    ->required(),
                TextInput::make('badge_name')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                DateTimePicker::make('earned_at')
                    ->required(),
            ]);
    }
}
