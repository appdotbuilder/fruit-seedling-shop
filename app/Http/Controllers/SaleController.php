<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = Sale::with(['customer', 'cashier', 'items.product'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::active()->get();
        $customers = User::customers()->get();
        
        return Inertia::render('sales/create', [
            'products' => $products,
            'customers' => $customers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            
            // Calculate total amount
            $totalAmount = 0;
            $saleItems = [];
            
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                
                if (!$product->hasEnoughStock($item['quantity'])) {
                    return back()->withErrors([
                        'items' => "Not enough stock for {$product->name}. Available: {$product->stock_quantity}"
                    ]);
                }
                
                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $item['quantity'];
                $totalAmount += $totalPrice;
                
                $saleItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ];
            }
            
            // Create the sale
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'cashier_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
            ]);
            
            // Create sale items and update stock
            foreach ($saleItems as $saleItem) {
                $saleItem['sale_id'] = $sale->id;
                SaleItem::create($saleItem);
                
                // Update product stock
                $product = Product::find($saleItem['product_id']);
                $product->decrement('stock_quantity', $saleItem['quantity']);
            }
            
            return redirect()->route('sales.show', $sale)
                ->with('success', 'Sale recorded successfully.');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $sale->load(['customer', 'cashier', 'items.product']);
        
        return Inertia::render('sales/show', [
            'sale' => $sale
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        return redirect()->route('sales.show', $sale);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        return redirect()->route('sales.show', $sale);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        return DB::transaction(function () use ($sale) {
            // Restore stock quantities
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock_quantity', $item->quantity);
                }
            }
            
            $sale->delete();
            
            return redirect()->route('sales.index')
                ->with('success', 'Sale deleted successfully and stock restored.');
        });
    }
}