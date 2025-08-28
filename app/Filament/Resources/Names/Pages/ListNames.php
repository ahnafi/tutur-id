<?php

namespace App\Filament\Resources\Names\Pages;

use App\Filament\Resources\Names\NameResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNames extends ListRecords
{
    protected static string $resource = NameResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
