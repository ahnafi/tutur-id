<?php

namespace App\Filament\Resources\Stories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class StoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                FileUpload::make('image')
                    ->image()
                    ->imageEditor()
                    ->directory("story-images")
                    ->columnSpanFull(),

                TextInput::make('title')
                    ->required(),
                TextInput::make('origin_place'),
                TextInput::make('gmaps_link'),
                Toggle::make('is_official')
                    ->required(),
                Select::make('created_by')
                    ->relationship('creator', 'name')
                    ->searchable(['name', 'email'])
                    ->preload()
                    ->required(),
                Select::make('story_category_id')
                    ->createOptionForm([
                        TextInput::make('name')
                            ->required(),
                    ])
                    ->relationship('storyCategory', 'name')
                    ->preload()
                    ->searchable()
                    ->required(),
                TextInput::make("total_reads")
                    ->visibleOn('edit')
                    ->numeric(),
                RichEditor::make('content')
                    ->columnSpanFull(),
                Select::make('verification_status')
                    ->options([
                        'pending_review' => 'Pending Review',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->default('pending_review')
                    ->required(),
            ]);
    }
}
