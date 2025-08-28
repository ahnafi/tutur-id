<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

        /*
        Create an admin user
        */
        $admin = User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $admin->assignRole('admin');

        /*
        Create an example user
        */
        $exampleUser = User::create([
            'name' => 'foo',
            'email' => 'foo@example.com',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $exampleUser->assignRole('user');

    }
}
