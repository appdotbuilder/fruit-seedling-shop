<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FruitSeedlingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@fruitseedlings.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create cashier users
        $cashier1 = User::create([
            'name' => 'John Cashier',
            'email' => 'cashier@fruitseedlings.com',
            'role' => 'cashier',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $cashier2 = User::factory()->cashier()->create([
            'name' => 'Jane Cashier',
            'email' => 'jane.cashier@fruitseedlings.com',
        ]);

        // Create customer users
        $customer1 = User::create([
            'name' => 'Customer User',
            'email' => 'customer@fruitseedlings.com',
            'role' => 'customer',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional customers
        $customers = User::factory()->customer()->count(15)->create();

        // Create products
        $products = [
            [
                'name' => '🍎 Premium Apple Seedling',
                'description' => 'High-quality apple seedling variety perfect for home gardens. Produces sweet, crisp apples in 2-3 years.',
                'price' => 25.00,
                'stock_quantity' => 50,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
            ],
            [
                'name' => '🥭 Tropical Mango Seedling',
                'description' => 'Exotic mango variety that thrives in warm climates. Sweet, juicy fruits ready in 3-4 years.',
                'price' => 35.00,
                'stock_quantity' => 30,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1553279123-325c0b0ba8b4?w=400',
            ],
            [
                'name' => '🥑 Hass Avocado Seedling',
                'description' => 'Popular Hass avocado variety known for creamy texture and rich flavor. Excellent for home cultivation.',
                'price' => 40.00,
                'stock_quantity' => 25,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
            ],
            [
                'name' => '🍊 Valencia Orange Seedling',
                'description' => 'Sweet Valencia orange variety perfect for juicing. Hardy and productive tree.',
                'price' => 30.00,
                'stock_quantity' => 40,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
            ],
            [
                'name' => '🍋 Meyer Lemon Seedling',
                'description' => 'Compact lemon tree variety ideal for containers. Produces fragrant, thin-skinned lemons.',
                'price' => 28.00,
                'stock_quantity' => 35,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
            ],
            [
                'name' => '🍇 Red Grape Vine',
                'description' => 'Premium red grape vine for fresh eating or wine making. Disease-resistant variety.',
                'price' => 22.00,
                'stock_quantity' => 60,
                'category' => 'fruit_seedling',
                'image_url' => 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create additional random products
        Product::factory()->count(20)->create();

        // Create some low stock products
        Product::factory()->lowStock()->count(5)->create();

        // Create some sales with items
        $allProducts = Product::all();
        $allCustomers = User::customers()->get();
        $allCashiers = collect([$cashier1, $cashier2]);

        for ($i = 0; $i < 25; $i++) {
            $sale = Sale::create([
                'customer_id' => $allCustomers->random()->id,
                'cashier_id' => $allCashiers->random()->id,
                'total_amount' => 0, // Will be calculated
                'status' => 'completed',
                'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
            ]);

            $totalAmount = 0;
            $itemCount = random_int(1, 4);

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $allProducts->random();
                $quantity = random_int(1, 3);
                $unitPrice = (float) $product->price;
                $totalPrice = $quantity * $unitPrice;
                $totalAmount += $totalPrice;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);
            }

            $sale->update(['total_amount' => $totalAmount]);
        }
    }
}