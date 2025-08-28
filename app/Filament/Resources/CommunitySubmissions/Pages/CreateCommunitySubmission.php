<?php

namespace App\Filament\Resources\CommunitySubmissions\Pages;

use App\Filament\Resources\CommunitySubmissions\CommunitySubmissionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCommunitySubmission extends CreateRecord
{
    protected static string $resource = CommunitySubmissionResource::class;
}
