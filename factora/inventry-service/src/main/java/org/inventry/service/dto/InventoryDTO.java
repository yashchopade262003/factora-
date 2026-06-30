package org.inventry.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.inventry.service.entity.InventoryStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class InventoryDTO {

    private Long vendorId;

    private Long warehouseId;

    private String materialCode;

    private String materialName;

    private String materialCategory;

    private Double quantity;

    private String unit;

    private Double unitPrice;

    private String warehouseLocation;

    private Long supplierId;

    private String batchNumber;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;

    private LocalDate receivedDate;

    private Double minimumStockLevel;

    private String remarks;

}