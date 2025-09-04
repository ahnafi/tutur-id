<?php

namespace App\Filament\Resources\UserPoints\Pages;

use App\Filament\Resources\UserPoints\UserPointResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUserPoint extends EditRecord
{
    protected static string $resource = UserPointResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
