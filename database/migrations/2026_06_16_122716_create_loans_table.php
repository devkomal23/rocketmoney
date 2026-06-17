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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Links to your users table
            $table->decimal('loan_amount', 10, 2);
            $table->string('account_number');
            $table->string('ifsc_code');
            $table->string('status')->default('pending');
            $table->string('agreement_path')->nullable(); // To store the PDF file path
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
