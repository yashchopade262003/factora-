package com.factoryflow.auth.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.factoryflow.auth.InterfaceService.IVendorService;
import com.factoryflow.auth.client.InventoryClient;
import com.factoryflow.auth.dao.VendorDAO;
import com.factoryflow.auth.dto.ApiResponse;
import com.factoryflow.auth.dto.InventoryDTO;
import com.factoryflow.auth.dto.VendorDTO;
import com.factoryflow.auth.entity.Vendor;
import com.factoryflow.auth.repository.VendorRepository;

@Service
public class VendorService implements IVendorService {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private VendorDAO vendordao;

    @Autowired
    private InventoryClient inventoryClient;

    @Override
    public VendorDTO addVendor(VendorDTO vendorDTO) {

        Vendor vendor =
                mapper.map(vendorDTO, Vendor.class);

        Vendor savedVendor =
                vendordao.save(vendor);

        return mapper.map(
                savedVendor,
                VendorDTO.class);
    }

    @Override
    public VendorDTO getVendorById(Long vendorId) {

        Vendor vendor =
                vendordao.findById(vendorId)
                .orElseThrow(() ->
                        new RuntimeException("Vendor Not Found"));

        return mapper.map(
                vendor,
                VendorDTO.class);
    }

    @Override
    public List<VendorDTO> getAllVendors() {

        return vendordao.findAll()
                .stream()
                .map(vendor ->
                        mapper.map(
                                vendor,
                                VendorDTO.class))
                .toList();
    }

    /**
     * Communicates with inventory-service to fetch the inventory recorded
     * against this vendor. Validates the vendor exists locally first (this
     * service owns the Vendor record), then delegates the inventory lookup
     * to InventoryClient.
     */
    @Override
    public List<InventoryDTO> getVendorInventory(Long vendorId) {

        // Ensures the vendor exists before calling out to inventory-service.
        getVendorById(vendorId);

        ApiResponse<List<InventoryDTO>> response = inventoryClient.getInventoryByVendor(vendorId);

        return response.getData();
    }


}