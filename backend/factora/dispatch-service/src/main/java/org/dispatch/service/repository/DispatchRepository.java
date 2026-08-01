package org.dispatch.service.repository;

import java.util.List;

import org.dispatch.service.entity.Dispatch;
import org.dispatch.service.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DispatchRepository extends JpaRepository<Dispatch, Long> {

	List<Dispatch> findByVendorId(Long vendorId);

	List<Dispatch> findByBuyerId(Long buyerId);

	List<Dispatch> findByDeliveryStatus(DeliveryStatus status);

	List<Dispatch> findByBuyerOrderId(Long buyerOrderId);
}
