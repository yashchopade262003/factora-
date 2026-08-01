package org.inventry.service.entity;


import java.time.LocalDate;
import java.time.LocalDateTime;



import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inventory_seq")
    @SequenceGenerator(name = "inventory_seq", sequenceName = "inventory_seq", initialValue = 101, allocationSize = 1)
    private Long inventoryId;

    // Multi-Vendor Support
    private Long vendorId;

    // Warehouse
    private Long warehouseId;

    // Material Details
    private String materialCode;

    private String materialName;

    private String materialCategory;

    // Stock Details
    private Double quantity;

    private String unit; // Kg, Ton, Liter, Piece

    // Pricing
    private Double unitPrice;

    private Double totalValue;

    // Storage
    private String warehouseLocation;

    // Supplier
    private Long supplierId;

    // Batch Details
    private String batchNumber;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;

    private LocalDate receivedDate;

    // Stock Status
    @Enumerated(EnumType.STRING)
    private InventoryStatus status;

    private Double minimumStockLevel;

    private String remarks;

    // Audit
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;

    // Optimistic locking: guards against lost updates when two requests
    // (e.g. concurrent stock-in / stock-out calls) modify the same row.
    @Version
    private Long version;

    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (totalValue == null && quantity != null && unitPrice != null) {
            totalValue = quantity * unitPrice;
        }
    }
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();

        if (quantity != null && unitPrice != null) {
            totalValue = quantity * unitPrice;
        }
    }
}