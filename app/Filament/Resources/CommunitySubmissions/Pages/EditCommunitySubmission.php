<?php

namespace App\Filament\Resources\CommunitySubmissions\Pages;

use App\Filament\Resources\CommunitySubmissions\CommunitySubmissionResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditCommunitySubmission extends EditRecord
{
    protected static string $resource = CommunitySubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
