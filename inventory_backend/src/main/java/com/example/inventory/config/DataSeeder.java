package com.example.inventory.config;

import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {
    
    @Bean
    @Profile("!test") // Don't run in tests
    CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> demoProducts = createDemoProducts();
                productRepository.saveAll(demoProducts);
                System.out.println("✅ Seeded " + demoProducts.size() + " demo products");
            } else {
                System.out.println("ℹ️  Products already exist, skipping seed");
            }
        };
    }
    
    private List<Product> createDemoProducts() {
        return Arrays.asList(
            createProduct("Aurora XR Pro Headset", "Electronics", 299.99, 45, 
                "Immersive virtual reality experience with 4K displays and advanced tracking",
                "🎮", "SKU_0001"),
            createProduct("PulseBand Vibe Smartwatch", "Electronics", 199.99, 32,
                "Track your fitness with heart rate monitoring and GPS tracking",
                "⌚", "SKU_0002"),
            createProduct("Nexus Ultra Laptop", "Computers", 1299.99, 18,
                "Powerful 16-inch laptop with latest processor and stunning display",
                "💻", "SKU_0003"),
            createProduct("ThunderBolt Wireless Mouse", "Accessories", 49.99, 67,
                "Ergonomic design with precision tracking and long battery life",
                "🖱️", "SKU_0004"),
            createProduct("Crystal Clear Monitor 27\"", "Displays", 349.99, 24,
                "4K UHD display with HDR support and ultra-slim bezels",
                "🖥️", "SKU_0005"),
            createProduct("Mechanical Pro Keyboard", "Accessories", 129.99, 41,
                "RGB backlit mechanical keyboard with Cherry MX switches",
                "⌨️", "SKU_0006"),
            createProduct("PowerHub USB-C Charger", "Accessories", 29.99, 89,
                "Fast charging 65W USB-C adapter with multiple ports",
                "🔌", "SKU_0007"),
            createProduct("CloudSync External SSD 1TB", "Storage", 149.99, 56,
                "Lightning-fast external SSD with USB 3.2 Gen 2",
                "💾", "SKU_0008"),
            createProduct("SoundWave Premium Headphones", "Audio", 179.99, 38,
                "Active noise cancellation with 30-hour battery life",
                "🎧", "SKU_0009"),
            createProduct("FlexStand Ergonomic Stand", "Accessories", 79.99, 72,
                "Adjustable laptop stand for better posture and airflow",
                "📐", "SKU_0010"),
            createProduct("StreamCam 4K Webcam", "Video", 129.99, 28,
                "Professional 4K webcam with auto-focus and noise reduction",
                "📹", "SKU_0011"),
            createProduct("Lightning Cable Pro 2m", "Cables", 24.99, 95,
                "Durable braided cable with fast charging support",
                "🔗", "SKU_0012"),
            createProduct("ZenPad Drawing Tablet", "Creative", 249.99, 15,
                "Pressure-sensitive drawing tablet for digital artists",
                "✏️", "SKU_0013"),
            createProduct("GamePad Pro Controller", "Gaming", 69.99, 52,
                "Wireless controller with haptic feedback and long battery",
                "🎯", "SKU_0014"),
            createProduct("SmartDesk Adjustable", "Furniture", 599.99, 8,
                "Electric height-adjustable desk with memory presets",
                "🪑", "SKU_0015"),
            createProduct("BlueTooth Speaker Max", "Audio", 89.99, 44,
                "360-degree sound with waterproof design and 20h battery",
                "🔊", "SKU_0016"),
            createProduct("DataGuard Backup Drive 2TB", "Storage", 89.99, 61,
                "Automatic backup solution with encryption",
                "💿", "SKU_0017"),
            createProduct("AirFlow Laptop Cooler", "Accessories", 39.99, 77,
                "Quiet cooling pad with RGB lighting and USB hub",
                "🌀", "SKU_0018"),
            createProduct("PixelPerfect Photo Printer", "Printing", 199.99, 19,
                "Wireless photo printer with borderless printing",
                "🖨️", "SKU_0019"),
            createProduct("SecureLock USB Drive 512GB", "Storage", 59.99, 83,
                "Hardware-encrypted USB drive with fingerprint sensor",
                "🔒", "SKU_0020")
        );
    }
    
    private Product createProduct(String name, String category, Double price, 
                                  Integer stock, String description, 
                                  String imageUrl, String skuId) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setStockLevel(stock);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setSkuId(skuId);
        return product;
    }
}

