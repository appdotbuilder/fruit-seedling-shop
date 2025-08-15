<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fruitTypes = [
            'Apple', 'Orange', 'Mango', 'Avocado', 'Cherry', 'Lemon', 'Lime',
            'Peach', 'Pear', 'Plum', 'Grape', 'Strawberry', 'Blueberry',
            'Banana', 'Papaya', 'Guava', 'Jackfruit', 'Dragon fruit'
        ];
        
        $fruitName = $this->faker->randomElement($fruitTypes);
        
        return [
            'name' => $fruitName . ' Seedling',
            'description' => "High-quality {$fruitName} seedling perfect for home gardening. " . 
                           $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 5, 50),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'image_url' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
            'category' => 'fruit_seedling',
            'is_active' => $this->faker->boolean(90),
        ];
    }

    /**
     * Indicate that the product is out of stock.
     *
     * @return static
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product is low in stock.
     *
     * @return static
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $this->faker->numberBetween(1, 5),
        ]);
    }

    /**
     * Indicate that the product is inactive.
     *
     * @return static
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}