<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stories = [
            [
                'title' => 'Malin Kundang',
                'content' => 'Cerita tentang seorang anak bernama Malin Kundang yang merantau ke negeri seberang dan menjadi kaya raya. Namun, saat kembali ke kampung halaman, ia malu mengakui ibunya yang miskin. Ibunya yang kecewa dan sakit hati kemudian mengutuk Malin Kundang menjadi batu sebagai balasan atas kedurhakaannya.',
                'origin_place' => 'Sumatera Barat',
                'gmaps_link' => 'https://maps.google.com/?q=Sumatera+Barat',
                'is_official' => true,
                'created_by' => 1,
                'total_reads' => 1250,
                'story_category_id' => 1,
                'image' => '/story-images/indonesian-folklore-malin-kundang-traditional-art.png',
                'verification_status' => 'approved',
            ],
            [
                'title' => 'Sangkuriang',
                'content' => 'Legenda tentang Sangkuriang, seorang pemuda yang jatuh cinta kepada Dayang Sumbi, yang ternyata adalah ibunya sendiri. Setelah mengetahui kebenarannya, Dayang Sumbi menolak lamaran Sangkuriang dan memberikan syarat mustahil, yaitu membuat danau dan perahu dalam semalam. Sangkuriang gagal, dan kemarahannya menyebabkan terbentuknya Gunung Tangkuban Perahu.',
                'origin_place' => 'Jawa Barat',
                'gmaps_link' => 'https://maps.google.com/?q=Jawa+Barat',
                'is_official' => true,
                'created_by' => 2,
                'total_reads' => 980,
                'story_category_id' => 1,
                'image' => '/story-images/indonesian-folklore-sangkuriang-traditional-art.png',
                'verification_status' => 'approved',
            ],
            [
                'title' => 'Keong Mas',
                'content' => 'Kisah seorang putri yang dikutuk oleh ibu tirinya menjadi seekor keong emas. Ia kemudian ditemukan oleh seorang nenek baik hati yang merawatnya. Berkat kebaikan sang nenek dan kekuatan ajaib, sang putri akhirnya kembali ke wujud manusia dan hidup bahagia.',
                'origin_place' => 'Jawa Timur',
                'gmaps_link' => 'https://maps.google.com/?q=Jawa+Timur',
                'is_official' => true,
                'created_by' => 3,
                'total_reads' => 750,
                'story_category_id' => 1,
                'image' => '/story-images/indonesian-folklore-keong-mas-traditional-art.png',
                'verification_status' => 'approved',
            ],
            [
                'title' => 'Timun Mas',
                'content' => 'Cerita tentang seorang gadis bernama Timun Mas yang lahir dari sebuah timun ajaib. Ia harus melarikan diri dari kejaran raksasa yang ingin memakannya. Dengan bantuan benda-benda ajaib dari ibunya, Timun Mas berhasil mengalahkan raksasa dan hidup bahagia bersama ibunya.',
                'origin_place' => 'Jawa Tengah',
                'gmaps_link' => 'https://maps.google.com/?q=Jawa+Tengah',
                'is_official' => true,
                'created_by' => 4,
                'total_reads' => 890,
                'story_category_id' => 1,
                'image' => '/story-images/indonesian-folklore-timun-mas-traditional-art.png',
                'verification_status' => 'approved',
            ],
            [
                'title' => 'Legenda Danau Toba Versi Kakek',
                'content' => 'Versi cerita Danau Toba yang diturunkan dari kakek saya di Batak. Dikisahkan seorang pemuda menikahi seorang putri ikan, dengan syarat rahasia asal usul sang putri tidak boleh diungkapkan. Namun, rahasia itu terbongkar dan sang putri kembali ke danau bersama anaknya, sehingga terbentuklah Danau Toba.',
                'origin_place' => 'Sumatera Utara',
                'gmaps_link' => 'https://maps.google.com/?q=Danau+Toba',
                'is_official' => false,
                'created_by' => 5,
                'total_reads' => 320,
                'story_category_id' => 2,
                'image' => '/story-images/indonesian-folklore-danau-toba-community-version.png',
                'verification_status' => 'approved',
            ],
            [
                'title' => 'Cerita Rakyat Kampung Halaman',
                'content' => 'Cerita turun temurun dari kampung saya tentang asal usul nama desa. Dulu, desa ini ditemukan oleh seorang tokoh yang tersesat di hutan dan menemukan sumber air yang melimpah. Dari situlah desa berkembang dan diberi nama sesuai dengan kejadian tersebut.',
                'origin_place' => 'Jawa Tengah',
                'gmaps_link' => 'https://maps.google.com/?q=Jawa+Tengah',
                'is_official' => false,
                'created_by' => 1,
                'total_reads' => 180,
                'story_category_id' => 2,
                'image' => '/story-images/indonesian-folklore-village-origin-community.png',
                'verification_status' => 'approved',
            ],
        ];

        foreach ($stories as $story) {
            \App\Models\Story::create($story);
        }
    }
}
