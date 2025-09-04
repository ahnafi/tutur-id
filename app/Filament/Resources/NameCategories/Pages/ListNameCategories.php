<?php

namespace App\Filament\Resources\NameCategories\Pages;

use App\Filament\Resources\NameCategories\NameCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNameCategories extends ListRecords
{
    protected static string $resource = NameCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
