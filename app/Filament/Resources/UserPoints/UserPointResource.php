<?php

namespace App\Filament\Resources\UserPoints;

use App\Filament\Resources\UserPoints\Pages\CreateUserPoint;
use App\Filament\Resources\UserPoints\Pages\EditUserPoint;
use App\Filament\Resources\UserPoints\Pages\ListUserPoints;
use App\Filament\Resources\UserPoints\Schemas\UserPointForm;
use App\Filament\Resources\UserPoints\Tables\UserPointsTable;
use App\Models\UserPoint;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserPointResource extends Resource
{
    protected static ?string $model = UserPoint::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHandThumbUp;

    public static function form(Schema $schema): Schema
    {
        return UserPointForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserPointsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUserPoints::route('/'),
            'create' => CreateUserPoint::route('/create'),
            'edit' => EditUserPoint::route('/{record}/edit'),
        ];
    }
}
