<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = [
            [
                "name" => "Arjuna",
                "meaning" => "Putih bersih, suci, dan mulia",
                "origin" => "Jawa",
                "description" => "Arjuna adalah salah satu tokoh utama dalam epik Mahabharata, dikenal akan keteguhan hati dan keberanian yang tak tergoyahkan. Ia melambangkan jiwa yang bersih, suci, dan mulia, seperti embun pagi yang menyejukkan bumi. Dalam setiap langkahnya, Arjuna mengajarkan tentang keadilan dan pengorbanan demi kebenaran.",
                "name_category_id" => 1,
            ],
            [
                "name" => "Dewi Sartika",
                "meaning" => "Dewi yang bercahaya dan mulia",
                "origin" => "Sunda",
                "description" => "Dewi Sartika adalah pahlawan nasional Indonesia yang memperjuangkan pendidikan untuk perempuan, bagaikan cahaya yang menembus gelapnya keterbatasan. Ia adalah lentera harapan bagi generasi masa depan, menginspirasi setiap jiwa untuk terus belajar dan berkembang, serta menebarkan kemuliaan di setiap langkah perjuangannya.",
                "name_category_id" => 2,
            ],
            [
                "name" => "Bayu",
                "meaning" => "Angin, kekuatan alam",
                "origin" => "Jawa",
                "description" => "Bayu melambangkan kekuatan dan kebebasan, seperti angin yang berhembus tanpa batas dan membawa kesejukan ke seluruh penjuru dunia. Ia adalah simbol semangat yang tak pernah padam, membebaskan jiwa dari belenggu dan mengajarkan tentang keteguhan dalam menghadapi segala tantangan kehidupan.",
                "name_category_id" => 1,
            ],
            [
                "name" => "Candra",
                "meaning" => "Bulan, cahaya di kegelapan",
                "origin" => "Sanskrit-Indonesia",
                "description" => "Candra adalah simbol ketenangan dan kedamaian, seperti bulan yang bersinar lembut di tengah gelapnya malam. Ia menjadi penuntun bagi hati yang gelisah, menghadirkan harapan dan keindahan dalam keheningan, serta mengajarkan tentang ketabahan dan keikhlasan dalam menghadapi liku-liku kehidupan.",
                "name_category_id" => 1,
            ],
            [
                "name" => "Kartika",
                "meaning" => "Bintang, cahaya yang membimbing",
                "origin" => "Jawa",
                "description" => "Kartika adalah bintang yang menjadi petunjuk arah di malam hari, bersinar terang di langit luas sebagai penanda harapan dan impian. Ia mengajarkan tentang ketekunan dan keyakinan, membimbing setiap langkah menuju tujuan mulia, serta menjadi inspirasi bagi jiwa-jiwa yang mencari cahaya dalam kegelapan.",
                "name_category_id" => 1,
            ],
            [
                "name" => "Surya",
                "meaning" => "Matahari, sumber kehidupan",
                "origin" => "Sanskrit-Indonesia",
                "description" => "Surya adalah simbol kekuatan dan kehidupan, seperti matahari yang menyinari dan menghangatkan bumi setiap pagi. Ia membawa semangat baru, membangkitkan harapan, dan menjadi sumber energi bagi segala makhluk. Surya mengajarkan tentang keberanian untuk bersinar dan memberi manfaat bagi sesama.",
                "name_category_id" => 1,
            ],
        ];

        foreach ($names as $name) {
            \App\Models\Name::create($name);
        }
    }
}
