import axios from 'axios';

export interface GeneratedName {
    name: string;
    meaning: string;
    origin: string;
    description: string;
    name_category_id: number;
}

export interface ChatGPTResponse {
    success: boolean;
    result: string;
    session: string;
}

export const generateNameFromAI = async (characteristics: string): Promise<GeneratedName> => {
    const prompt = `Temukan makna mendalam dari nama-nama tradisional atau bersifat ke daerahan yang terdapat di Indonesia setiap kali pengguna menginputkan karakteristik (entah itu makna, simbol, karakter, atau yang lain) dan jelajahi warisan budaya yang tersimpan dalam setiap nama. Generate hasilnya dengan FORMAT JSON SAJA, JANGAN TAMBAHIN TEKS LAIN DAN CUKUP 1 DATA SAJA dengan isinya kurang lebih seperti ini
{
"name",
"meaning", 
"origin",
"description",
"name_category_id"
}
untuk name_category_id isinya kurang lebih seperti ini kalau di seeder, jadi menyesuaikan id nya dari 0 (index)
[
    'Tradisional',
    'Modern', 
    'Unik',
    'Alkitabiah',
    'Mitologis',
    'Terinspirasi Alam',
    'Berbasis Kebajikan',
    'Budaya',
    'Sejarah',
    'Terinspirasi Selebriti',
]`;

    try {
        const response = await axios.get<ChatGPTResponse>('https://api.ryzumi.vip/api/ai/chatgpt', {
            params: {
                text: characteristics,
                prompt: prompt,
            },
        });

        if (response.data.success) {
            // Parse JSON result from ChatGPT
            const generatedName: GeneratedName = JSON.parse(response.data.result);

            // Convert index to actual ID (add 1 since database IDs start from 1)
            generatedName.name_category_id = generatedName.name_category_id + 1;

            return generatedName;
        } else {
            throw new Error('Failed to generate name from AI');
        }
    } catch (error) {
        console.error('Error generating name:', error);
        throw new Error('Gagal menghasilkan nama. Silakan coba lagi.');
    }
};
