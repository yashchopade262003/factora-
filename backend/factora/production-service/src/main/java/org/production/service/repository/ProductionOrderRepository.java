package org.production.service.repository;

import java.util.List;

import org.production.service.entity.ProductionOrder;
import org.production.service.entity.ProductionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {

	List<ProductionOrder> findByVendorId(Long vendorId);

	List<ProductionOrder> findByStatus(ProductionStatus status);

	List<ProductionOrder> findByVendorIdAndStatus(Long vendorId, ProductionStatus status);

	List<ProductionOrder> findByBatchNumber(String batchNumber);
}
