<?php

namespace App\Filament\Resources\NameCategories\Pages;

use App\Filament\Resources\NameCategories\NameCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditNameCategory extends EditRecord
{
    protected static string $resource = NameCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
