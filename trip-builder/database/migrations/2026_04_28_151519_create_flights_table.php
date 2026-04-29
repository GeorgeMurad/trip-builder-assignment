<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('airline_id')->constrained()->cascadeOnDelete();
        
            $table->string('number');
        
            $table->foreignId('departure_airport_id')
                  ->constrained('airports')
                  ->cascadeOnDelete();
        
            $table->foreignId('arrival_airport_id')
                  ->constrained('airports')
                  ->cascadeOnDelete();
        
            $table->time('departure_time');
            $table->time('arrival_time');
        
            $table->decimal('price', 10, 2);
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};
