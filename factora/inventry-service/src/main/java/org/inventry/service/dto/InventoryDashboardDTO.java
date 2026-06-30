package org.inventry.service.dto;

import lombok.Data;

@Data
public class InventoryDashboardDTO {

    private Long totalMaterials;

    private Long availableMaterials;

    private Long lowStockMaterials;

    private Long outOfStockMaterials;

    private Double inventoryValue;

}