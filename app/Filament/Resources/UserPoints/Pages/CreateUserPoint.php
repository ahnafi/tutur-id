<?php

namespace App\Filament\Resources\UserPoints\Pages;

use App\Filament\Resources\UserPoints\UserPointResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserPoint extends CreateRecord
{
    protected static string $resource = UserPointResource::class;
}
