<?php

namespace App\Filament\Resources\QuizResults\Pages;

use App\Filament\Resources\QuizResults\QuizResultResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListQuizResults extends ListRecords
{
    protected static string $resource = QuizResultResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
