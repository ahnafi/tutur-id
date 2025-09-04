<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
            'name' => 'Ahmad Fauzi',
            'email' => 'ahmad.fauzi@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Dewi Lestari',
            'email' => 'dewi.lestari@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Rizky Pratama',
            'email' => 'rizky.pratama@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Intan Permata',
            'email' => 'intan.permata@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Agus Saputra',
            'email' => 'agus.saputra@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Maya Sari',
            'email' => 'maya.sari@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Fajar Nugroho',
            'email' => 'fajar.nugroho@example.com',
            'password' => bcrypt('password'),
            ],
            [
            'name' => 'Putri Ayu',
            'email' => 'putri.ayu@example.com',
            'password' => bcrypt('password'),
            ],
        ];

        foreach ($users as $user) {
           $newUser =  \App\Models\User::create($user);
           $newUser->assignRole('user');
        }
    }
}
