<?php

namespace App\Filament\Resources\CommunitySubmissions\Pages;

use App\Filament\Resources\CommunitySubmissions\CommunitySubmissionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCommunitySubmissions extends ListRecords
{
    protected static string $resource = CommunitySubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
