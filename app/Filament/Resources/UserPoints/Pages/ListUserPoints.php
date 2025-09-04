<?php

namespace App\Filament\Resources\UserPoints\Pages;

use App\Filament\Resources\UserPoints\UserPointResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUserPoints extends ListRecords
{
    protected static string $resource = UserPointResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
