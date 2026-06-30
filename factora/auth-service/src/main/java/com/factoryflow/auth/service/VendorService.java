package com.factoryflow.auth.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.factoryflow.auth.InterfaceService.IVendorService;
import com.factoryflow.auth.dao.VendorDAO;
import com.factoryflow.auth.dto.VendorDTO;
import com.factoryflow.auth.entity.Vendor;
import com.factoryflow.auth.repository.VendorRepository;

@Service
public class VendorService implements IVendorService {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private VendorDAO vendordao;

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


}