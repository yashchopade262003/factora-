package org.buyer.service.repository;

import java.util.List;

import org.buyer.service.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {

	List<Buyer> findByVendorId(Long vendorId);
}
