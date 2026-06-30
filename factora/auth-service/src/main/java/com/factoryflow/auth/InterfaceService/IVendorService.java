package com.factoryflow.auth.InterfaceService;

import java.util.List;

import com.factoryflow.auth.dto.VendorDTO;

public interface IVendorService {
	VendorDTO addVendor(VendorDTO vendorDTO);

	VendorDTO getVendorById(Long vendorId);

	List<VendorDTO> getAllVendors();
	
}
