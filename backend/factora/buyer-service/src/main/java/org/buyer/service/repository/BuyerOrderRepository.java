package org.buyer.service.repository;

import java.util.List;

import org.buyer.service.entity.BuyerOrder;
import org.buyer.service.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerOrderRepository extends JpaRepository<BuyerOrder, Long> {

	List<BuyerOrder> findByVendorId(Long vendorId);

	List<BuyerOrder> findByBuyerId(Long buyerId);

	List<BuyerOrder> findByStatus(OrderStatus status);
}
