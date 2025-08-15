<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FruitSeedlingShopTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create users with different roles
        $this->admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
        ]);
        
        $this->cashier = User::factory()->cashier()->create([
            'email' => 'cashier@test.com',
        ]);
        
        $this->customer = User::factory()->customer()->create([
            'email' => 'customer@test.com',
        ]);
    }

    public function test_welcome_page_displays_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('welcome'));
    }

    public function test_admin_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('dashboard'));
    }

    public function test_cashier_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->cashier)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('dashboard'));
    }

    public function test_customer_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->customer)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('dashboard'));
    }

    public function test_admin_can_create_products(): void
    {
        $productData = [
            'name' => 'Test Apple Seedling',
            'description' => 'A test apple seedling for testing purposes.',
            'price' => 25.99,
            'stock_quantity' => 50,
            'category' => 'fruit_seedling',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('products.store'), $productData);

        $response->assertRedirect(route('products.index'));
        $this->assertDatabaseHas('products', [
            'name' => 'Test Apple Seedling',
            'price' => '25.99',
        ]);
    }

    public function test_cashier_cannot_create_products(): void
    {
        $productData = [
            'name' => 'Test Apple Seedling',
            'description' => 'A test apple seedling for testing purposes.',
            'price' => 25.99,
            'stock_quantity' => 50,
            'category' => 'fruit_seedling',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->cashier)
            ->post(route('products.store'), $productData);

        $response->assertRedirect('/dashboard');
    }

    public function test_cashier_can_create_sales(): void
    {
        $product = Product::factory()->create([
            'stock_quantity' => 10,
        ]);

        $saleData = [
            'customer_id' => $this->customer->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ]
            ],
            'notes' => 'Test sale',
        ];

        $response = $this->actingAs($this->cashier)
            ->post(route('sales.store'), $saleData);

        $this->assertDatabaseHas('sales', [
            'customer_id' => $this->customer->id,
            'cashier_id' => $this->cashier->id,
        ]);

        // Check stock was reduced
        $product->refresh();
        $this->assertEquals(8, $product->stock_quantity);
    }

    public function test_product_model_relationships(): void
    {
        $product = Product::factory()->create();
        $sale = Sale::factory()->create();
        
        $saleItem = SaleItem::factory()->create([
            'product_id' => $product->id,
            'sale_id' => $sale->id,
        ]);

        $this->assertTrue($product->saleItems->contains($saleItem));
    }

    public function test_sale_model_relationships(): void
    {
        $sale = Sale::factory()->create([
            'customer_id' => $this->customer->id,
            'cashier_id' => $this->cashier->id,
        ]);

        $this->assertEquals($this->customer->id, $sale->customer->id);
        $this->assertEquals($this->cashier->id, $sale->cashier->id);
    }

    public function test_user_role_methods(): void
    {
        $this->assertTrue($this->admin->isAdmin());
        $this->assertFalse($this->admin->isCashier());
        $this->assertFalse($this->admin->isCustomer());

        $this->assertFalse($this->cashier->isAdmin());
        $this->assertTrue($this->cashier->isCashier());
        $this->assertFalse($this->cashier->isCustomer());

        $this->assertFalse($this->customer->isAdmin());
        $this->assertFalse($this->customer->isCashier());
        $this->assertTrue($this->customer->isCustomer());
    }

    public function test_product_stock_methods(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $this->assertTrue($product->isInStock());
        $this->assertTrue($product->hasEnoughStock(5));
        $this->assertFalse($product->hasEnoughStock(15));

        $outOfStockProduct = Product::factory()->create(['stock_quantity' => 0]);
        $this->assertFalse($outOfStockProduct->isInStock());
    }

    public function test_sale_calculation_methods(): void
    {
        $sale = Sale::factory()->create();
        
        $item1 = SaleItem::factory()->create([
            'sale_id' => $sale->id,
            'quantity' => 2,
            'unit_price' => 10.00,
            'total_price' => 20.00,
        ]);
        
        $item2 = SaleItem::factory()->create([
            'sale_id' => $sale->id,
            'quantity' => 1,
            'unit_price' => 15.00,
            'total_price' => 15.00,
        ]);

        $this->assertEquals(35.00, $sale->calculateTotal());
    }
}