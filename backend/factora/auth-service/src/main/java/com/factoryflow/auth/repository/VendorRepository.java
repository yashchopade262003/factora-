package com.factoryflow.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.factoryflow.auth.entity.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByVendorCode(String vendorCode);

    Optional<Vendor> findByEmail(String email);
}
