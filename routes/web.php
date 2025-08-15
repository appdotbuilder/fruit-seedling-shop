<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - shows different content based on user role
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (same as home for authenticated users)
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    
    // Customer product browsing (All authenticated users)
    Route::get('/shop', [ProductController::class, 'index'])->name('shop');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
});

// Admin routes
Route::middleware(['auth', 'verified', App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::resource('products', ProductController::class)->except(['show']);
    Route::resource('users', UserController::class);
});

// Cashier and Admin routes
Route::middleware(['auth', 'verified', App\Http\Middleware\CashierOrAdminMiddleware::class])->group(function () {
    Route::resource('sales', SaleController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
